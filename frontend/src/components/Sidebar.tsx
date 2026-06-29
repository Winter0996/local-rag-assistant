import FileUpload from "./FileUpload";
import DocumentList from "./DocumentList";

interface Props {
  refreshTrigger: number;
  selectedDocIds: string[];
  onSelectionChange: (docIds: string[]) => void;
  onUploadSuccess: () => void;
}

export default function Sidebar({
  refreshTrigger,
  selectedDocIds,
  onSelectionChange,
  onUploadSuccess,
}: Props) {
  return (
    <aside
      className="w-full lg:w-80 shrink-0 flex flex-col gap-4 p-4 border-b lg:border-b-0 lg:border-r overflow-y-auto"
      style={{ borderColor: "var(--border)" }}
    >
      <FileUpload onUploadSuccess={onUploadSuccess} />
      <DocumentList
        refreshTrigger={refreshTrigger}
        selectedDocIds={selectedDocIds}
        onSelectionChange={onSelectionChange}
      />
    </aside>
  );
}
