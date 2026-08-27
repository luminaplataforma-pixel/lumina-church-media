import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ContentDialog } from "@/components/content-dialog";
import { MediaPreview } from "@/components/media-preview";
import { EmptyState, LoadingGrid, PageHeader, ProgressBar, StatusPill } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRows } from "@/lib/data";
import {
  checklistProgress,
  formatDateBR,
  STATUS_LIST,
  STATUS_META,
  TYPE_LIST,
  TYPE_META,
} from "@/lib/lumina";
import type { ContentRow, TeamMemberRow } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos — Lumina" },
      {
        name: "description",
        content: "Gerencie todos os conteúdos da mídia da igreja com checklist e progresso.",
      },
      { property: "og:title", content: "Conteúdos — Lumina" },
      { property: "og:description", content: "CRUD completo de conteúdos da igreja." },
    ],
  }),
  component: Conteudos,
});

function Conteudos() {
  const { data, isLoading } = useRows<ContentRow>("contents");
  const members = useRows<TeamMemberRow>("team_members");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todos");
  const [type, setType] = useState("todos");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentRow | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (c) =>
        (status === "todos" || c.status === status) &&
        (type === "todos" || c.type === type) &&
        (!term ||
          c.title.toLowerCase().includes(term) ||
          (c.theme ?? "").toLowerCase().includes(term) ||
          (c.caption_text ?? "").toLowerCase().includes(term)),
    );
  }, [data, q, status, type]);

  const ownerName = (id: string | null) =>
    id ? (members.data?.find((m) => m.id === id)?.name ?? null) : null;

  return (
    <>
      <PageHeader
        title="Conteúdos"
        subtitle="Todo o acervo de publicações da sua igreja, da ideia ao publicado."
        actions={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Novo conteúdo
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por título, tema ou legenda..."
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {STATUS_LIST.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {TYPE_LIST.map((t) => (
              <SelectItem key={t} value={t}>
                {TYPE_META[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-8" />}
          title="Nenhum conteúdo encontrado"
          description="Crie o primeiro conteúdo e comece o planejamento da sua mídia."
          action={
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Criar conteúdo
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setEditing(c);
                setOpen(true);
              }}
              className="surface overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <MediaPreview url={c.image_url} alt={c.title} className="aspect-video" rounded="" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 font-medium">{c.title}</p>
                  <StatusPill status={c.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{TYPE_META[c.type]}</span>
                  <span>{formatDateBR(c.publish_date)}</span>
                </div>
                <ProgressBar value={Math.max(STATUS_META[c.status].progress, checklistProgress(c.checklist))} />
                {ownerName(c.owner_id) && (
                  <p className="text-xs text-muted-foreground">
                    Responsável: {ownerName(c.owner_id)}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <ContentDialog open={open} onOpenChange={setOpen} content={editing} />
    </>
  );
}
