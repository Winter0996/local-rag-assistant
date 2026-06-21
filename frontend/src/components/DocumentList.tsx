import { useEffect, useState } from "react";
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

  if (loading) return <div className="text-sm text-gray-400">Loading documents...</div>;

  if (documents.length === 0) {
    return <div className="text-sm text-gray-400">No documents uploaded yet.</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Uploaded Documents</h3>
        {selectedDocIds.length > 0 && (
          <button
            onClick={() => onSelectionChange([])}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear filter
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400">
        {selectedDocIds.length === 0
          ? "Searching all documents — check boxes to scope your question"
          : `Scoped to ${selectedDocIds.length} document(s)`}
      </p>
      <ul className="space-y-1">
        {documents.map(doc => (
          <li
            key={doc.doc_id}
            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border text-sm"
          >
            <label className="flex items-center gap-2 flex-1 cursor-pointer truncate">
              <input
                type="checkbox"
                checked={selectedDocIds.includes(doc.doc_id)}
                onChange={() => toggleSelection(doc.doc_id)}
              />
              <span className="text-gray-700 truncate">{doc.filename}</span>
            </label>
            <button
              onClick={() => handleDelete(doc.doc_id)}
              className="text-red-500 hover:text-red-700 text-xs ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}