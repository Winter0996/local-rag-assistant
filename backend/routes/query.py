from flask import Blueprint, request, jsonify
from services.embedder import embed_texts
from services.vector_store import query_similar
from services.llm import generate_answer

query_bp = Blueprint("query", __name__)

@query_bp.route("/api/query", methods=["POST"])
def query():
    data = request.json
    question = data.get("question")
    doc_ids = data.get("doc_ids")
    history = data.get("history")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    query_embedding = embed_texts([question])[0]
    results = query_similar(query_embedding, n_results=5, doc_ids=doc_ids)

    chunks = results["documents"][0]
    metadatas = results["metadatas"][0]
    answer = generate_answer(question, chunks, history=history)
    sources = [{"filename": m["filename"], "chunk_index": m["chunk_index"]} for m in metadatas]

    return jsonify({"answer": answer, "sources": sources, "context": chunks})