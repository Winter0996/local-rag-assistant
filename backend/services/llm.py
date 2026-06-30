import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

class OllamaConnectionError(Exception):
    pass


def generate_answer(question: str, context_chunks: list[str], history: list[dict] | None = None, model: str = "llama3") -> str:
    context = "\n\n---\n\n".join(context_chunks)

    history_text = ""
    if history:
        for turn in history[-6:]:
            role = "User" if turn["role"] == "user" else "Assistant"
            history_text += f"{role}: {turn['content']}\n"

    prompt = f"""You are a helpful assistant. Answer the question using ONLY the context below.
If the answer is not in the context, say "I couldn't find that in the uploaded documents."

Context:
{context}

{f"Previous conversation:\n{history_text}" if history_text else ""}

Question: {question}

Answer:"""

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }, timeout=30)
        response.raise_for_status()
    except requests.exceptions.ConnectionError:
        raise OllamaConnectionError("Could not connect to Ollama. Make sure it's running (ollama serve).")
    except requests.exceptions.Timeout:
        raise OllamaConnectionError("Ollama took too long to respond. Try again.")

    return response.json()["response"]


def stream_answer(question: str, context_chunks: list[str], history: list[dict] | None = None, model: str = "llama3"):
    context = "\n\n---\n\n".join(context_chunks)

    history_text = ""
    if history:
        for turn in history[-6:]:
            role = "User" if turn["role"] == "user" else "Assistant"
            history_text += f"{role}: {turn['content']}\n"

    prompt = f"""You are a helpful assistant. Answer the question using ONLY the context below.
If the answer is not in the context, say "I couldn't find that in the uploaded documents."

Context:
{context}

{f"Previous conversation:\n{history_text}" if history_text else ""}

Question: {question}

Answer:"""

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": model,
            "prompt": prompt,
            "stream": True
        }, stream=True, timeout=30)
        response.raise_for_status()
    except requests.exceptions.ConnectionError:
        raise OllamaConnectionError("Could not connect to Ollama. Make sure it's running (ollama serve).")
    except requests.exceptions.Timeout:
        raise OllamaConnectionError("Ollama took too long to respond. Try again.")

    for line in response.iter_lines():
        if line:
            data = json.loads(line)
            token = data.get("response", "")
            done = data.get("done", False)
            yield token, done