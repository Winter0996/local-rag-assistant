import axios from "axios";

const API  = axios.create({baseURL: "http://localhost:5000" });

export const uploadDocument = (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return API.post("/api/upload", form);
};

export const askQuestion = (question: string, docIds?: string[], history?: {role: string; content: string}[]) => 
    API.post("/api/query", { question, doc_ids: docIds, history });

export const getDocuments = () => 
    API.get("/api/documents");

export const deleteDocument = (doc_id: string) => 
    API.delete(`/api/documents/${doc_id}`);