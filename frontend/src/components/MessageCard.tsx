import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import SourceCitation from "./SourceCitation";

interface Source {
  filename: string;
  chunk_index: number;
}

interface Props {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  context?: string[];
  isStreaming?: boolean;
  theme: "dark" | "light";
}

export default function MessageCard({
  role,
  content,
  sources,
  context,
  isStreaming,
  theme,
}: Props) {
  const isUser = role === "user";
  const proseClass = theme === "dark" ? "prose-invert" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-2xl w-full sm:w-auto rounded-xl border p-4 shadow-sm"
        style={{
          background: isUser ? "var(--card-user)" : "var(--card-assistant)",
          borderColor: "var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className={`prose prose-sm max-w-none ${proseClass}`}
          style={{ color: "var(--text)" }}
        >
          {content ? (
            <div className={isStreaming ? "streaming-cursor" : ""}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : isStreaming ? (
            <span className="text-sm streaming-cursor" style={{ color: "var(--text-muted)" }}>
              Thinking
            </span>
          ) : null}
        </div>

        {!isUser && content && sources && sources.length > 0 && context && (
          <SourceCitation sources={sources} context={context} />
        )}
      </div>
    </motion.div>
  );
}
