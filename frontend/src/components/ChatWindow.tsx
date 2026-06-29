import { useState, type Dispatch, type SetStateAction } from "react";
import { Send } from "lucide-react";
import { streamQuestion } from "../api/client";
import MessageCard from "./MessageCard";
import { useTheme } from "../context/ThemeContext";

interface Source {
  filename: string;
  chunk_index: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  context?: string[];
}

interface Props {
  selectedDocIds: string[];
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export default function ChatWindow({ selectedDocIds, messages, setMessages }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input;
    const userMsg: Message = { role: "user", content: question };
    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [
      ...prev,
      userMsg,
      { role: "assistant", content: "", sources: [], context: [] },
    ]);
    setInput("");
    setLoading(true);

    await streamQuestion(
      question,
      selectedDocIds.length > 0 ? selectedDocIds : undefined,
      history,
      token => {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + token };
          return updated;
        });
      },
      (sources, context) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], sources, context };
          return updated;
        });
      },
      () => setLoading(false)
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEmpty && (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-sm text-center max-w-sm" style={{ color: "var(--text-muted)" }}>
              Upload a document in the sidebar, then ask a question about your content.
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isLastAssistant =
            msg.role === "assistant" && i === messages.length - 1 && loading;
          return (
            <MessageCard
              key={i}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
              context={msg.context}
              isStreaming={isLastAssistant}
              theme={theme}
            />
          );
        })}
      </div>

      <div
        className="flex gap-2 p-4 border-t shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <input
          className="flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[(--accent)]/40"
          style={{
            background: "var(--input-bg)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask a question about your documents..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-40"
          style={{ background: "var(--accent)" }}
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}
