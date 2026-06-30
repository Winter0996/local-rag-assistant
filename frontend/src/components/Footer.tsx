export default function Footer() {
    return (
      <footer
        className="px-4 py-3 text-center text-xs shrink-0 border-t"
        style={{
          background: "var(--navbar-bg)",
          borderColor: "var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>
          © 2026 · Built with React, TypeScript, Tailwind CSS, ChromaDB, Vite · Coded in Cursor · Deployed on Vercel
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          Developed by Nathan Winter
        </p>
      </footer>
    );
  }