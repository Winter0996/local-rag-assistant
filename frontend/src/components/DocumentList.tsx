import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Trash2 } from "lucide-react";
import { getDocuments, deleteDocument } from "../api/client";

interface Document {
  doc_id: string;
  filename: string;
}

interface Props {
  refreshTrigger: number;
  selectedDocIds: string[];
  onSelectionChange: (docIds: string[]) => void;
}

export default function DocumentList({ refreshTrigger, selectedDocIds, onSelectionChange }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getDocuments();
        if (!cancelled) setDocuments(res.data.documents);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
      if (!cancelled) setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument(docId);
      setDocuments(prev => prev.filter(d => d.doc_id !== docId));
      onSelectionChange(selectedDocIds.filter(id => id !== docId));
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const toggleSelection = (docId: string) => {
    if (selectedDocIds.includes(docId)) {
      onSelectionChange(selectedDocIds.filter(id => id !== docId));
    } else {
      onSelectionChange([...selectedDocIds, docId]);
    }
  };

  if (loading) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Loading documents...
      </p>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Uploaded Documents
        </h3>
        {selectedDocIds.length > 0 && (
          <button
            onClick={() => onSelectionChange([])}
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            Clear filter
          </button>
        )}
      </div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {selectedDocIds.length === 0
          ? "Searching all documents — check boxes to scope your question"
          : `Scoped to ${selectedDocIds.length} document(s)`}
      </p>
      <ul className="space-y-1.5">
        {documents.map((doc, i) => (
          <motion.li
            key={doc.doc_id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            style={{
              background: selectedDocIds.includes(doc.doc_id)
                ? "var(--surface-hover)"
                : "var(--surface)",
              borderColor: "var(--border)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label className="flex items-center gap-2 flex-1 cursor-pointer truncate min-w-0">
              <input
                type="checkbox"
                checked={selectedDocIds.includes(doc.doc_id)}
                onChange={() => toggleSelection(doc.doc_id)}
                className="accent-[#c11e38] shrink-0"
              />
              <FileText size={14} className="shrink-0" style={{ color: "var(--text-muted)" }} />
              <span className="truncate" style={{ color: "var(--text)" }}>
                {doc.filename}
              </span>
            </label>
            <button
              onClick={() => handleDelete(doc.doc_id)}
              className="p-1 rounded transition-colors hover:bg-[(--surface-hover)] shrink-0 ml-2"
              style={{ color: "var(--accent)" }}
              aria-label={`Delete ${doc.filename}`}
            >
              <Trash2 size={14} />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
