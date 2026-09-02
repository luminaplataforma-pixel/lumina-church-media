import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MediaPreview } from "@/components/media-preview";
import { UploadDropzone } from "@/components/upload-dropzone";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ui-bits";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import {
  CHECKLIST_ITEMS,
  checklistProgress,
  STATUS_LIST,
  STATUS_META,
  TYPE_LIST,
  TYPE_META,
  type ContentStatus,
  type ContentType,
} from "@/lib/lumina";
import type { CaptionRow, ContentRow, EventRow, TeamMemberRow, VerseRow } from "@/lib/types";

const NONE = "__none__";

type Draft = {
  id?: string;
  title: string;
  theme: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  publish_date: string;
  owner_id: string;
  event_id: string;
  verse_id: string;
  caption_id: string;
  image_url: string;
  caption_text: string;
  notes: string;
  checklist: Record<string, boolean>;
};

const EMPTY: Draft = {
  title: "",
  theme: "",
  description: "",
  type: "feed",
  status: "ideia",
  publish_date: "",
  owner_id: "",
  event_id: "",
  verse_id: "",
  caption_id: "",
  image_url: "",
  caption_text: "",
  notes: "",
  checklist: {},
};

export function ContentDialog({
  open,
  onOpenChange,
  content,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  content?: ContentRow | null;
  defaultDate?: string | undefined;
}) {
  const save = useSaveRow("contents", "conteúdo");
  const remove = useDeleteRow("contents", "conteúdo");
  const members = useRows<TeamMemberRow>("team_members", { order: "name", ascending: true });
  const events = useRows<EventRow>("events", { order: "event_date", ascending: true });
  const verses = useRows<VerseRow>("verses");
  const captions = useRows<CaptionRow>("captions");

  const [draft, setDraft] = useState<Draft>(EMPTY);

  useEffect(() => {
    if (!open) return;
    if (content) {
      setDraft({
        id: content.id,
        title: content.title,
        theme: content.theme ?? "",
        description: content.description ?? "",
        type: content.type,
        status: content.status,
        publish_date: content.publish_date ?? "",
        owner_id: content.owner_id ?? "",
        event_id: content.event_id ?? "",
        verse_id: content.verse_id ?? "",
        caption_id: content.caption_id ?? "",
        image_url: content.image_url ?? "",
        caption_text: content.caption_text ?? "",
        notes: content.notes ?? "",
        checklist: content.checklist ?? {},
      });
    } else {
      setDraft({ ...EMPTY, publish_date: defaultDate ?? "" });
    }
  }, [open, content, defaultDate]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    await save.mutateAsync({
      ...(draft.id ? { id: draft.id } : {}),
      title: draft.title.trim(),
      theme: draft.theme || null,
      description: draft.description || null,
      type: draft.type,
      status: draft.status,
      publish_date: draft.publish_date || null,
      owner_id: draft.owner_id || null,
      event_id: draft.event_id || null,
      verse_id: draft.verse_id || null,
      caption_id: draft.caption_id || null,
      image_url: draft.image_url || null,
      caption_text: draft.caption_text || null,
      notes: draft.notes || null,
      checklist: draft.checklist,
    });
    onOpenChange(false);
  }

  const progress = checklistProgress(draft.checklist);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{draft.id ? "Editar conteúdo" : "Novo conteúdo"}</DialogTitle>
          <DialogDescription>
            Defina tema, status, mídia e relacionamentos deste conteúdo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void submit(e)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                required
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ex.: Convite culto de domingo"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tema</Label>
              <Input value={draft.theme} onChange={(e) => set("theme", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Data de publicação</Label>
              <Input
                type="date"
                value={draft.publish_date}
                onChange={(e) => set("publish_date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={draft.type} onValueChange={(v) => set("type", v as ContentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_LIST.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_META[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => set("status", v as ContentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_LIST.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_META[s].label} · {STATUS_META[s].progress}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Select
                value={draft.owner_id || NONE}
                onValueChange={(v) => set("owner_id", v === NONE ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sem responsável</SelectItem>
                  {(members.data ?? []).map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Evento relacionado</Label>
              <Select
                value={draft.event_id || NONE}
                onValueChange={(v) => set("event_id", v === NONE ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhum</SelectItem>
                  {(events.data ?? []).map((ev) => (
                    <SelectItem key={ev.id} value={ev.id}>
                      {ev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Versículo</Label>
              <Select
                value={draft.verse_id || NONE}
                onValueChange={(v) => {
                  set("verse_id", v === NONE ? "" : v);
                  const vv = verses.data?.find((x) => x.id === v);
                  if (vv && !draft.caption_text)
                    set("caption_text", `“${vv.text}” — ${vv.book} ${vv.chapter}:${vv.verse}`);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhum</SelectItem>
                  {(verses.data ?? []).map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.book} {v.chapter}:{v.verse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Legenda salva</Label>
              <Select
                value={draft.caption_id || NONE}
                onValueChange={(v) => {
                  set("caption_id", v === NONE ? "" : v);
                  const c = captions.data?.find((x) => x.id === v);
                  if (c) set("caption_text", c.text);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Nenhuma</SelectItem>
                  {(captions.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição / briefing</Label>
            <Textarea
              rows={3}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Legenda do post</Label>
              <AIAssistant
                defaultPrompt={draft.title}
                onUse={(text) => set("caption_text", text)}
                trigger={
                  <Button type="button" size="sm" variant="ghost" className="gap-1.5">
                    <Sparkles className="size-3.5" /> Gerar com IA
                  </Button>
                }
              />
            </div>
            <Textarea
              rows={5}
              value={draft.caption_text}
              onChange={(e) => set("caption_text", e.target.value)}
              placeholder="Escreva ou gere a legenda..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Arte do conteúdo</Label>
              <UploadDropzone
                onUploaded={(files) => files[0] && set("image_url", files[0].url)}
                hint="Arraste a arte aqui"
              />
              <Input
                value={draft.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="ou cole uma URL de imagem/vídeo"
              />
            </div>
            <div className="space-y-2">
              <Label>Pré-visualização</Label>
              <MediaPreview url={draft.image_url} alt={draft.title} className="aspect-square" />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <Label>Checklist de produção</Label>
              <span className="text-xs text-muted-foreground">{progress}% concluído</span>
            </div>
            <ProgressBar value={progress} />
            <div className="grid gap-2 sm:grid-cols-2">
              {CHECKLIST_ITEMS.map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={!!draft.checklist[item.key]}
                    onCheckedChange={(v) =>
                      set("checklist", { ...draft.checklist, [item.key]: !!v })
                    }
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea rows={2} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {draft.id ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost" className="gap-2 text-destructive">
                    <Trash2 className="size-4" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir este conteúdo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        remove.mutate(draft.id!);
                        onOpenChange(false);
                      }}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={save.isPending} className="gap-2">
                {save.isPending && <Loader2 className="size-4 animate-spin" />} Salvar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
