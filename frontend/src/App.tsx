import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatWindow, { type Message } from "./components/ChatWindow";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="flex flex-col h-full">
      <Navbar
        hasMessages={messages.length > 0}
        onClearChat={() => setMessages([])}
      />
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <Sidebar
          refreshTrigger={refreshTrigger}
          selectedDocIds={selectedDocIds}
          onSelectionChange={setSelectedDocIds}
          onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)}
        />
        <main className="flex-1 min-h-0 min-w-0">
          <ChatWindow
            selectedDocIds={selectedDocIds}
            messages={messages}
            setMessages={setMessages}
          />
        </main>
      </div>
    </div>
  );
}
