from flask import Blueprint, request, jsonify
from services.parser import parse_file
from services.chunker import chunk_text
from services.embedder import embed_texts
from services.vector_store import add_document
import os, uuid

upload_bp = Blueprint("upload", __name__)
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = (".pdf", ".txt", ".md")

@upload_bp.route("/api/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    if not file or file.filename == "":
        return jsonify({"error": "No file provided"}), 400

    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        return jsonify({"error": f"Unsupported file type. Please upload a PDF, TXT, or MD file."}), 400

    doc_id = str(uuid.uuid4())
    filepath = os.path.join(UPLOAD_FOLDER, f"{doc_id}_{file.filename}")

    try:
        file.save(filepath)
        text = parse_file(filepath, file.filename)

        if not text or not text.strip():
            os.remove(filepath)
            return jsonify({"error": f"Couldn't extract any text from {file.filename}. The file may be empty, scanned, or corrupted."}), 400

        chunks = chunk_text(text)
        embeddings = embed_texts(chunks)
        add_document(doc_id, chunks, embeddings, file.filename)

        return jsonify({"doc_id": doc_id, "filename": file.filename, "chunks": len(chunks)})

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"Failed to process {file.filename}: {str(e)}"}), 500