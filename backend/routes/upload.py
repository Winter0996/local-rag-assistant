from flask import Blueprint, request, jsonify
from services.parser import parse_file
from services.chunker import chunk_text
from services.embedder import embed_texts
from services.vector_store import add_document
import os, uuid

upload_bp = Blueprint("upload", __name__)
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route("/api/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    doc_id = str(uuid.uuid4())
    filepath = os.path.join(UPLOAD_FOLDER, f"{doc_id}_{file.filename}")
    file.save(filepath)

    try:
        text = parse_file(filepath, file.filename)
        chunks = chunk_text(text)
        embeddings = embed_texts(chunks)
        add_document(doc_id, chunks, embeddings, file.filename)
        return jsonify({"doc_id": doc_id, "filename": file.filename, "chunks": len(chunks)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500