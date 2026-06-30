# local-rag-assistant

A fully local, privacy-first Retrieval-Augmented Generation (RAG) application that lets you upload documents and ask questions about them — powered entirely by open-source tools running on your own machine. No API keys, no per-token costs, no data leaving your computer.

![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.12-blue)
![React](https://img.shields.io/badge/react-19-61DAFB)
![TypeScript](https://img.shields.io/badge/typescript-5-3178C6)

## Demo

> 📸 _Screenshots/GIF coming soon — add a short demo showing upload → ask → streamed answer with source citations._

## Features

- **Document Upload** — Drag-and-drop PDF, TXT, and MD files with real-time validation and error feedback
- **Source Citations** — Every answer links back to the exact document chunks used, expandable for verification
- **Multi-Document Filtering** — Scope questions to specific uploaded documents instead of searching everything
- **Conversation History** — Multi-turn dialogue with context carried across follow-up questions
- **Streaming Responses** — Answers appear token-by-token in real time via Server-Sent Events
- **Dark/Light Mode** — Persistent theme toggle with a custom crimson glassmorphism design
- **Graceful Error Handling** — Clear, user-facing messages for unsupported files, empty documents, and backend/LLM connection issues

## Tech Stack

**Backend**
- Flask (REST API + SSE streaming)
- ChromaDB (vector store for semantic search)
- Sentence-Transformers (`all-MiniLM-L6-v2` for embeddings)
- Ollama running Llama 3 (local LLM inference, no API costs)

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion (animations)
- react-dropzone, react-markdown

## Architecture

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React UI   │ ───▶ │  Flask API   │ ───▶ │  ChromaDB   │
│ (TypeScript) │ ◀─── │  (Python)    │ ◀─── │ (vector DB) │
└─────────────┘ SSE   └──────┬───────┘      └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   Ollama    │
                       │ (Llama 3)   │
                       └─────────────┘
```

**Flow:** Upload → parse (pdfplumber) → chunk (overlapping windows) → embed (Sentence-Transformers) → store (ChromaDB) → query → retrieve top-k chunks via cosine similarity → ground LLM response (Ollama/Llama 3) → stream tokens back to UI with source citations.

## Getting Started

### Prerequisites
- [Python 3.12+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/) installed and running locally

### 1. Clone the repo
```bash
git clone https://github.com/Winter0996/local-rag-assistant.git
cd local-rag-assistant
```

### 2. Set up Ollama
```bash
ollama pull llama3
```
Ollama runs as a background service after install — no need to manually start it.

### 3. Set up the backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`.

### 4. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 5. Use it
Open `http://localhost:5173`, upload a PDF/TXT/MD file, and start asking questions.

## Why Fully Local?

This project intentionally runs entirely on-device rather than relying on hosted APIs like OpenAI or Anthropic. That means:
- **Zero API costs** — no per-token billing, ever
- **Full data privacy** — uploaded documents never leave your machine
- **No rate limits** — query as much as your hardware allows

The tradeoff is that it isn't deployed to the cloud as a live demo — running it requires Ollama and a local Python/Node environment. See the setup steps above to run it yourself in a few minutes.

## Project Highlights

- Architected a full RAG pipeline using Sentence-Transformers and ChromaDB for semantic search over private document collections, with zero reliance on paid APIs
- Built a Flask REST API with document ingestion, chunking, and cosine-similarity retrieval to ground LLM responses and reduce hallucination
- Implemented Server-Sent Events (SSE) for real-time token streaming, replacing blocking request/response calls with a responsive, ChatGPT-style UX
- Developed a React/TypeScript frontend with drag-and-drop upload, multi-document filtering, expandable source citations, and persistent dark/light theming
- Integrated Ollama to run Llama 3 entirely on-device, eliminating API costs and ensuring all document data stays local

## Roadmap

- [ ] Persistent chat history (database-backed, survives refresh)
- [ ] Support for DOCX and CSV uploads
- [ ] Retrieval evaluation metrics (precision/recall on test query sets)

## License

MIT

---

**Developed by Nathan Winter**
