import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { uploadDocument } from "../api/client";

interface Props {
  onUploadSuccess: (filename: string) => void;
}

export default function FileUpload({ onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      setUploading(true);
      for (const file of acceptedFiles) {
        try {
          await uploadDocument(file);
          onUploadSuccess(file.name);
        } catch (err) {
          console.error("Upload failed:", err);
          setError(`Failed to upload ${file.name}`);
        }
      }
      setUploading(false);
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [], "text/plain": [], "text/markdown": [] },
    disabled: uploading,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <motion.div
          animate={{
            scale: isDragActive ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
          style={{
            background: isDragActive ? "var(--surface-hover)" : "var(--surface)",
            borderColor: isDragActive ? "var(--accent)" : "var(--border)",
            backdropFilter: "blur(8px)",
            boxShadow: isDragActive ? "0 0 24px rgba(193, 30, 56, 0.25)" : "none",
          }}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -2 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-2"
          >
            <Upload
              size={24}
              style={{ color: isDragActive ? "var(--accent)" : "var(--text-muted)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {uploading
                ? "Uploading..."
                : isDragActive
                  ? "Drop your file here..."
                  : "Drag & drop a PDF, TXT, or MD file, or click to browse"}
            </p>
          </motion.div>
        </motion.div>
      </div>
      {error && (
        <p className="mt-2 text-xs" style={{ color: "var(--accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
