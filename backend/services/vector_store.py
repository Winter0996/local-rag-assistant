import chromadb
import uuid

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("documents")

def add_document(doc_id: str, chunks: list[str], embeddings: list, filename: str):
    ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [{"doc_id": doc_id, "filename": filename, "chunk_index": i}
                 for i, _ in enumerate(chunks)]
    collection.add(documents=chunks, embeddings=embeddings, ids=ids, metadatas=metadatas)

def query_similar(query_embedding: list, n_results: int = 5) -> dict:
    return collection.query(query_embeddings=[query_embedding], n_results=n_results)

def delete_document(doc_id: str):
    results = collection.get(where={"doc_id": doc_id})
    if results["ids"]:
        collection.delete(ids=results["ids"])