import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-800">local-rag-assistant</h1>
        <p className="text-sm text-gray-500">Upload documents and ask questions</p>
      </header>
      <div className="p-4 border-b">
        <FileUpload onUploadSuccess={(name) => setUploadedDocs(prev => [...prev, name])} />
        {uploadedDocs.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Loaded: {uploadedDocs.join(", ")}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}