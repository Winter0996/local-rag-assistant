from flask import Blueprint, jsonify
from services.vector_store import list_documents, delete_document

documents_bp = Blueprint("documents", __name__)

@documents_bp.route("/api/documents", methods=["GET"])
def get_documents():
    docs = list_documents()
    return jsonify({"documents": docs})

@documents_bp.route("/api/documents/<doc_id>", methods=["DELETE"])
def remove_document(doc_id):
    delete_document(doc_id)
    return jsonify({"success": True})