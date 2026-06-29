import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, HelpCircle, X } from "lucide-react";

const SUPPORTED_TYPES = [
  { ext: "PDF", desc: "Portable Document Format (.pdf)" },
  { ext: "TXT", desc: "Plain text files (.txt)" },
  { ext: "MD", desc: "Markdown files (.md)" },
];

export default function AboutPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-[(--surface-hover)]"
        style={{ color: "var(--text-muted)" }}
        aria-label="About supported file types"
      >
        <HelpCircle size={16} />
        <span className="hidden sm:inline">About</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-xl border p-4 shadow-xl z-50"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Supported File Types
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-0.5 rounded hover:bg-[(--surface-hover)]"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>
            </div>
            <ul className="space-y-2">
              {SUPPORTED_TYPES.map(({ ext, desc }) => (
                <li
                  key={ext}
                  className="flex items-start gap-2 text-xs rounded-lg p-2"
                  style={{ background: "var(--surface-hover)" }}
                >
                  <FileText size={14} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                  <div>
                    <span className="font-medium" style={{ color: "var(--text)" }}>{ext}</span>
                    <p style={{ color: "var(--text-muted)" }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
              Upload documents, then ask questions scoped to selected files or all indexed content.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
