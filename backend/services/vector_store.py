import chromadb
import uuid

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("documents")

def add_document(doc_id: str, chunks: list[str], embeddings: list, filename: str):
    ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [{"doc_id": doc_id, "filename": filename, "chunk_index": i}
                 for i, _ in enumerate(chunks)]
    collection.add(documents=chunks, embeddings=embeddings, ids=ids, metadatas=metadatas)

def query_similar(query_embedding: list, n_results: int = 5, doc_ids: list[str] | None = None) -> dict:
    where_filter = {"doc_id": {"$in": doc_ids}} if doc_ids else None
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=where_filter
    )
    
def delete_document(doc_id: str):
    results = collection.get(where={"doc_id": doc_id})
    if results["ids"]:
        collection.delete(ids=results["ids"])

def list_documents() -> list[dict]:
    results = collection.get()
    seen = {}
    for metadata in results["metadatas"]:
        doc_id = metadata["doc_id"]
        if doc_id not in seen:
            seen[doc_id] = {"doc_id": doc_id, "filename": metadata["filename"]}
    return list(seen.values())