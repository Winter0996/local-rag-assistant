import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import DocumentList from "./components/DocumentList";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-800">local-rag-assistant</h1>
        <p className="text-sm text-gray-500">Upload documents and ask questions</p>
      </header>
      <div className="p-4 border-b space-y-3">
        <FileUpload onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)} />
        <DocumentList refreshTrigger={refreshTrigger} />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}