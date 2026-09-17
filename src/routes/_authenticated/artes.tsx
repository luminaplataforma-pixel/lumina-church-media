import { createFileRoute } from "@tanstack/react-router";
import { Download, Grid3x3, Image as ImageIcon, List, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { MediaPreview } from "@/components/media-preview";
import { UploadDropzone } from "@/components/upload-dropzone";
import { EmptyState, LoadingGrid, PageHeader } from "@/components/ui-bits";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBulkInsert, useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import { ASSET_FOLDERS } from "@/lib/lumina";
import type { AssetRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/artes")({
  head: () => ({
    meta: [
      { title: "Biblioteca de Artes — Lumyes" },
      {
        name: "description",
        content: "Organize artes, fotos e vídeos da igreja em pastas com preview e download.",
      },
      { property: "og:title", content: "Biblioteca de Artes — Lumyes" },
      { property: "og:description", content: "Upload direto, pastas e preview real das artes." },
    ],
  }),
  component: Artes,
});

function Artes() {
  const { data, isLoading } = useRows<AssetRow>("assets");
  const bulk = useBulkInsert("assets", "arte");
  const save = useSaveRow("assets", "arte");
  const remove = useDeleteRow("assets", "arte");
  const [folder, setFolder] = useState("todas");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const [uploadFolder, setUploadFolder] = useState(ASSET_FOLDERS[0]!);
  const [editing, setEditing] = useState<AssetRow | null>(null);
  const [name, setName] = useState("");
  const [editFolder, setEditFolder] = useState(ASSET_FOLDERS[0]!);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (a) =>
        (folder === "todas" || a.folder === folder) &&
        (!term || a.name.toLowerCase().includes(term)),
    );
  }, [data, folder, q]);

  return (
    <>
      <PageHeader
        title="Biblioteca de Artes"
        subtitle="Todas as artes, fotos e vídeos da sua igreja em um só lugar."
      />

      <div className="surface space-y-3 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Label className="shrink-0">Enviar para a pasta</Label>
          <Select value={uploadFolder} onValueChange={setUploadFolder}>
            <SelectTrigger className="sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSET_FOLDERS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <UploadDropzone
          multiple
          hint="Arraste várias artes aqui"
          onUploaded={(files) =>
            bulk.mutate(
              files.map((f) => ({
                name: f.name,
                url: f.url,
                storage_path: f.path,
                folder: uploadFolder,
                mime_type: f.type,
                size_bytes: f.size,
              })),
            )
          }
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar arte..."
            className="pl-9"
          />
        </div>
        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className="sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as pastas</SelectItem>
            {ASSET_FOLDERS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          <Button
            variant={mode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setMode("grid")}
            aria-label="Visualizar em grade"
          >
            <Grid3x3 className="size-4" />
          </Button>
          <Button
            variant={mode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setMode("list")}
            aria-label="Visualizar em lista"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="size-8" />}
          title="Nenhuma arte encontrada"
          description="Envie arquivos direto do seu dispositivo para começar a biblioteca."
        />
      ) : (
        <div
          className={cn(
            mode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "surface divide-y divide-border",
          )}
        >
          {filtered.map((a) =>
            mode === "grid" ? (
              <article key={a.id} className="surface overflow-hidden">
                <MediaPreview url={a.url} alt={a.name} className="aspect-square" rounded="" />
                <div className="space-y-2 p-3">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.folder}</p>
                  <AssetActions
                    asset={a}
                    onEdit={() => {
                      setEditing(a);
                      setName(a.name);
                      setEditFolder(a.folder);
                    }}
                    onDelete={() => remove.mutate(a.id)}
                  />
                </div>
              </article>
            ) : (
              <div key={a.id} className="flex items-center gap-4 p-3">
                <MediaPreview url={a.url} alt={a.name} className="size-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.folder}</p>
                </div>
                <AssetActions
                  asset={a}
                  onEdit={() => {
                    setEditing(a);
                    setName(a.name);
                    setEditFolder(a.folder);
                  }}
                  onDelete={() => remove.mutate(a.id)}
                />
              </div>
            ),
          )}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar arte</DialogTitle>
            <DialogDescription>Renomeie ou mova o arquivo de pasta.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Pasta</Label>
              <Select value={editFolder} onValueChange={setEditFolder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_FOLDERS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                save.mutate({ id: editing!.id, name, folder: editFolder });
                setEditing(null);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AssetActions({
  asset,
  onEdit,
  onDelete,
}: {
  asset: AssetRow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" asChild aria-label="Baixar">
        <a href={asset.url} target="_blank" rel="noreferrer" download={asset.name}>
          <Download className="size-4" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Editar">
        <Pencil className="size-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-destructive" aria-label="Excluir">
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir “{asset.name}”?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
