import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../api/client";

interface Document {
  doc_id: string;
  filename: string;
}

interface Props {
  refreshTrigger: number;
}

export default function DocumentList({ refreshTrigger }: Props) {
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
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  if (loading) return <div className="text-sm text-gray-400">Loading documents...</div>;

  if (documents.length === 0) {
    return <div className="text-sm text-gray-400">No documents uploaded yet.</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Uploaded Documents</h3>
      <ul className="space-y-1">
        {documents.map(doc => (
          <li
            key={doc.doc_id}
            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border text-sm"
          >
            <span className="text-gray-700 truncate">{doc.filename}</span>
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