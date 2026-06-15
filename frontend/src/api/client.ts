import axios from "axios";

const API  = axios.create({baseURL: "http://localhost:5000" });

export const uploadDocument = (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return API.post("/api/upload", form);
};

export const askQuestion = (question: string) => 
    API.post("/api/query", { question });