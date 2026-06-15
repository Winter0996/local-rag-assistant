import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDocument } from "../api/client";

interface Props {
  onUploadSuccess: (filename: string) => void;
}

export default function FileUpload({ onUploadSuccess }: Props) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        await uploadDocument(file);
        onUploadSuccess(file.name);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  }, [onUploadSuccess]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [], "text/plain": [], "text/markdown": [] }
  });

  return (
    <div
    {...getRootProps()}
    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
      ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
  >
    <input {...getInputProps()} />
    <p className="text-gray-500">
      {isDragActive ? "Drop your file here..." : "Drag & drop a PDF, TXT, or MD file, or click to browse"}
    </p>
  </div>
);
}