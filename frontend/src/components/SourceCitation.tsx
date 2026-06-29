import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Source {
  filename: string;
  chunk_index: number;
}

interface Props {
  sources: Source[];
  context: string[];
}

export default function SourceCitation({ sources, context }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (sources.length === 0) return null;

  const uniqueFilenames = [...new Set(sources.map(s => s.filename))];

  return (
    <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
        style={{ color: "var(--accent)" }}
      >
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          <ChevronDown size={14} />
        </motion.span>
        {expanded ? "Hide sources" : `View sources (${uniqueFilenames.join(", ")})`}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {sources.map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg border p-2.5 text-xs"
                  style={{
                    background: "var(--surface-hover)",
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>
                    {source.filename} — chunk {source.chunk_index}
                  </div>
                  <div className="line-clamp-4">{context[i]}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
