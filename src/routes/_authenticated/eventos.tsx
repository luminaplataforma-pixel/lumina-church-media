import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import { EVENT_STATUS_META, formatDateBR, type EventStatus } from "@/lib/lumina";
import type { EventRow } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos — Lumina" },
      {
        name: "description",
        content: "Cadastre cultos, conferências e eventos da igreja com data, local e responsável.",
      },
      { property: "og:title", content: "Eventos — Lumina" },
      { property: "og:description", content: "Agenda completa dos eventos da igreja." },
    ],
  }),
  component: Eventos,
});

type Draft = {
  id?: string;
  name: string;
  event_date: string;
  event_time: string;
  description: string;
  location: string;
  leader: string;
  image_url: string;
  status: EventStatus;
};

const EMPTY: Draft = {
  name: "",
  event_date: "",
  event_time: "",
  description: "",
  location: "",
  leader: "",
  image_url: "",
  status: "planejado",
};

function Eventos() {
  const { data, isLoading } = useRows<EventRow>("events", { order: "event_date", ascending: true });
  const save = useSaveRow("events", "evento");
  const remove = useDeleteRow("events", "evento");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (e) => !term || e.name.toLowerCase().includes(term) || (e.location ?? "").toLowerCase().includes(term),
    );
  }, [data, q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(
      {
        ...(draft.id ? { id: draft.id } : {}),
        name: draft.name.trim(),
        event_date: draft.event_date,
        event_time: draft.event_time || null,
        description: draft.description || null,
        location: draft.location || null,
        leader: draft.leader || null,
        image_url: draft.image_url || null,
        status: draft.status,
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <>
      <PageHeader
        title="Eventos"
        subtitle="Cultos, conferências e programações da sua igreja."
        actions={
          <Button
            className="gap-2"
            onClick={() => {
              setDraft(EMPTY);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Novo evento
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar evento..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarRange className="size-8" />}
          title="Nenhum evento cadastrado"
          description="Cadastre os cultos e eventos para conectá-los aos conteúdos e escalas."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ev) => (
            <article key={ev.id} className="surface overflow-hidden">
              <MediaPreview url={ev.image_url} alt={ev.name} className="aspect-video" rounded="" />
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{ev.name}</p>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs">
                    {EVENT_STATUS_META[ev.status]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDateBR(ev.event_date)} {ev.event_time?.slice(0, 5) ?? ""}
                </p>
                {ev.location && <p className="text-xs text-muted-foreground">{ev.location}</p>}
                <div className="flex gap-1 pt-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar"
                    onClick={() => {
                      setDraft({
                        id: ev.id,
                        name: ev.name,
                        event_date: ev.event_date,
                        event_time: ev.event_time?.slice(0, 5) ?? "",
                        description: ev.description ?? "",
                        location: ev.location ?? "",
                        leader: ev.leader ?? "",
                        image_url: ev.image_url ?? "",
                        status: ev.status,
                      });
                      setOpen(true);
                    }}
                  >
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
                        <AlertDialogTitle>Excluir “{ev.name}”?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove.mutate(ev.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar evento" : "Novo evento"}</DialogTitle>
            <DialogDescription>Informe data, local e responsável pelo evento.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Data *</Label>
                <Input
                  type="date"
                  required
                  value={draft.event_date}
                  onChange={(e) => setDraft({ ...draft, event_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Horário</Label>
                <Input
                  type="time"
                  value={draft.event_time}
                  onChange={(e) => setDraft({ ...draft, event_time: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={draft.status}
                  onValueChange={(v) => setDraft({ ...draft, status: v as EventStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(EVENT_STATUS_META) as EventStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {EVENT_STATUS_META[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Local</Label>
                <Input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Responsável</Label>
                <Input
                  value={draft.leader}
                  onChange={(e) => setDraft({ ...draft, leader: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Imagem do evento</Label>
                <UploadDropzone
                  onUploaded={(files) => files[0] && setDraft({ ...draft, image_url: files[0].url })}
                />
                <Input
                  value={draft.image_url}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                  placeholder="ou cole uma URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Pré-visualização</Label>
                <MediaPreview url={draft.image_url} alt={draft.name} className="aspect-video" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={save.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
