import { useState } from "react";

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
    <div className="mt-3 border-t pt-2">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        {expanded ? "Hide sources" : `View sources (${uniqueFilenames.join(", ")})`}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded p-2 text-xs text-gray-600"
            >
              <div className="font-semibold text-gray-700 mb-1">
                {source.filename} — chunk {source.chunk_index}
              </div>
              <div className="line-clamp-3">{context[i]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}