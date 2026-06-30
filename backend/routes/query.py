from flask import Blueprint, request, jsonify, Response
from services.embedder import embed_texts
from services.vector_store import query_similar
from services.llm import generate_answer, stream_answer, OllamaConnectionError
import json

query_bp = Blueprint("query", __name__)

@query_bp.route("/api/query", methods=["POST"])
def query():
    data = request.json
    question = data.get("question")
    doc_ids = data.get("doc_ids")
    history = data.get("history")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        query_embedding = embed_texts([question])[0]
        results = query_similar(query_embedding, n_results=5, doc_ids=doc_ids)

        chunks = results["documents"][0]
        if not chunks:
            return jsonify({
                "error": "No documents found to search. Upload a document first, or clear your document filter."
            }), 400

        metadatas = results["metadatas"][0]
        answer = generate_answer(question, chunks, history=history)
        sources = [{"filename": m["filename"], "chunk_index": m["chunk_index"]} for m in metadatas]

        return jsonify({"answer": answer, "sources": sources, "context": chunks})

    except OllamaConnectionError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Something went wrong: {str(e)}"}), 500


@query_bp.route("/api/query/stream", methods=["POST"])
def query_stream():
    data = request.json
    question = data.get("question")
    doc_ids = data.get("doc_ids")
    history = data.get("history")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        query_embedding = embed_texts([question])[0]
        results = query_similar(query_embedding, n_results=5, doc_ids=doc_ids)

        chunks = results["documents"][0]
        if not chunks:
            return jsonify({
                "error": "No documents found to search. Upload a document first, or clear your document filter."
            }), 400

        metadatas = results["metadatas"][0]
        sources = [{"filename": m["filename"], "chunk_index": m["chunk_index"]} for m in metadatas]
    except Exception as e:
        return jsonify({"error": f"Something went wrong: {str(e)}"}), 500

    def generate():
        try:
            yield f"data: {json.dumps({'type': 'meta', 'sources': sources, 'context': chunks})}\n\n"
            for token, done in stream_answer(question, chunks, history=history):
                yield f"data: {json.dumps({'type': 'token', 'token': token, 'done': done})}\n\n"
                if done:
                    break
        except OllamaConnectionError as e:
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'error': f'Something went wrong: {str(e)}'})}\n\n"

    return Response(generate(), mimetype="text/event-stream")