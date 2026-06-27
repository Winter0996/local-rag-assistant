import axios from "axios";

const API  = axios.create({baseURL: "http://localhost:5000" });

export const uploadDocument = (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return API.post("/api/upload", form);
};

export const askQuestion = (question: string, docIds?: string[], history?: {role: string; content: string}[]) => 
    API.post("/api/query", { question, doc_ids: docIds, history });

export const streamQuestion = async (
    question: string,
    docIds: string[] | undefined,
    history: { role: string; content: string }[],
    onToken: (token: string) => void,
    onMeta: (sources: { filename: string; chunk_index: number }[], context: string[]) => void,
    onDone: () => void
  ) => {
    const response = await fetch("http://localhost:5000/api/query/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, doc_ids: docIds, history }),
    });
  
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
  
      const text = decoder.decode(value);
      const lines = text.split("\n").filter(l => l.startsWith("data: "));
  
      for (const line of lines) {
        const json = JSON.parse(line.slice(6));
        if (json.type === "meta") {
          onMeta(json.sources, json.context);
        } else if (json.type === "token") {
          onToken(json.token);
          if (json.done) onDone();
        }
      }
    }
  };

export const getDocuments = () => 
    API.get("/api/documents");

export const deleteDocument = (doc_id: string) => 
    API.delete(`/api/documents/${doc_id}`);