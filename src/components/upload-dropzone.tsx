import { Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadToStorage } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

export type UploadedFile = { path: string; url: string; name: string; type: string; size: number };

export function UploadDropzone({
  onUploaded,
  multiple = false,
  accept = "image/*,video/*",
  className,
  hint = "Arraste seu arquivo aqui",
}: {
  onUploaded: (files: UploadedFile[]) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
  hint?: string;
}) {
  const { workspaceId } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0 || !workspaceId) return;
    setBusy(true);
    try {
      const results: UploadedFile[] = [];
      for (const file of Array.from(list)) {
        const { path, url } = await uploadToStorage(workspaceId, file);
        results.push({ path, url, name: file.name, type: file.type, size: file.size });
      }
      onUploaded(results);
      toast.success(`${results.length} arquivo(s) enviado(s).`);
    } catch (e) {
      toast.error((e as Error).message || "Falha no upload.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        void handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-8 text-center transition-colors hover:border-primary hover:bg-primary/5",
        over && "border-primary bg-primary/10",
        className,
      )}
    >
      {busy ? (
        <Loader2 className="size-6 animate-spin text-primary" />
      ) : (
        <UploadCloud className="size-6 text-muted-foreground" />
      )}
      <p className="text-sm font-medium">{busy ? "Enviando..." : hint}</p>
      <p className="text-xs text-muted-foreground">ou selecionar arquivo do computador</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
