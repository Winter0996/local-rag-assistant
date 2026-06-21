import { useState } from "react";
import { askQuestion } from "../api/client";
import ReactMarkdown from "react-markdown";
import SourceCitation from "./SourceCitation";

interface Source {
  filename: string;
  chunk_index: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  context?: string[];
}

interface Props {
  selectedDocIds: string[];

}

export default function ChatWindow({ selectedDocIds }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const history = updatedMessages.map(m => ({ role: m.role, content: m.content }));

    const res = await askQuestion(
      input,
      selectedDocIds.length > 0 ? selectedDocIds : undefined,
      history
    );

    const botMsg: Message = {
      role: "assistant",
      content: res.data.answer,
      sources: res.data.sources,
      context: res.data.context,
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
       <div className="flex items-center justify-between px-4 pt-2">
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
          >
            Clear conversation
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-2xl p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {msg.sources && msg.context && (
                <SourceCitation sources={msg.sources} context={msg.context} />
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">Thinking...</div>}
      </div>
      <div className="flex gap-2 p-4 border-t">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask a question about your documents..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}