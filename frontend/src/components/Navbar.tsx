import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import AboutPopover from "./AboutPopover";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const GITHUB_URL = "https://github.com/Winter0996/local-rag-assistant";

interface Props {
  onClearChat: () => void;
  hasMessages: boolean;
}

export default function Navbar({ onClearChat, hasMessages }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="flex items-center justify-between px-4 py-3 border-b shrink-0"
      style={{
        background: "var(--navbar-bg)",
        borderColor: "var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div>
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          local-rag-assistant
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
          Upload documents and ask questions
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <AboutPopover />

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-[(--surface-hover)]"
          style={{ color: "var(--text-muted)" }}
          aria-label="View on GitHub"
        >
          <GitHubIcon size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>

        {hasMessages && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-[(--surface-hover)]"
            style={{ color: "var(--text-muted)" }}
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear chat</span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-[(--surface-hover)]"
          style={{ color: "var(--text)" }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </nav>
  );
}
