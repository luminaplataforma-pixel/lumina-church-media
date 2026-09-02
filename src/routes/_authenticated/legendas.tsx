import { createFileRoute } from "@tanstack/react-router";
import { Copy, Pencil, PenLine, Plus, Search, Sparkles, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, LoadingGrid, PageHeader } from "@/components/ui-bits";
import { runLuminaAI } from "@/lib/ai.functions";
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
import { Textarea } from "@/components/ui/textarea";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import type { CaptionRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/legendas")({
  head: () => ({
    meta: [
      { title: "Banco de Legendas — Lumina" },
      {
        name: "description",
        content: "Crie, salve e reutilize legendas prontas para as publicações da igreja.",
      },
      { property: "og:title", content: "Banco de Legendas — Lumina" },
      { property: "og:description", content: "Legendas reutilizáveis com apoio da IA." },
    ],
  }),
  component: Legendas,
});

type Draft = {
  id?: string;
  title: string;
  text: string;
  category: string;
  kind: string;
  favorite: boolean;
};

const EMPTY: Draft = { title: "", text: "", category: "", kind: "", favorite: false };

function Legendas() {
  const { data, isLoading } = useRows<CaptionRow>("captions");
  const save = useSaveRow("captions", "legenda");
  const remove = useDeleteRow("captions", "legenda");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiFormat, setAiFormat] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiPending, setAiPending] = useState(false);

  async function generateWithAI() {
    if (!aiPrompt.trim()) {
      toast.error("Descreva o tema da legenda.");
      return;
    }
    setAiPending(true);
    setAiText("");
    const res = await runLuminaAI({
      data: {
        mode: "legenda",
        prompt: aiPrompt.trim(),
        format: aiFormat || undefined,
        goal: aiGoal || undefined,
      },
    });
    setAiPending(false);
    if (res.error || !res.text) {
      toast.error(res.error ?? "A IA não conseguiu gerar agora.");
      return;
    }
    setAiText(res.text);
  }

  function saveAICaption() {
    const title = aiPrompt.trim().slice(0, 80) || "Legenda gerada por IA";
    save.mutate(
      { title, text: aiText.trim(), category: null, kind: aiFormat || null, favorite: false },
      {
        onSuccess: () => {
          setAiOpen(false);
          setAiPrompt("");
          setAiFormat("");
          setAiGoal("");
          setAiText("");
          toast.success("Legenda salva no banco!");
        },
      },
    );
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (c) =>
        !term || c.title.toLowerCase().includes(term) || c.text.toLowerCase().includes(term),
    );
  }, [data, q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(
      {
        ...(draft.id ? { id: draft.id } : {}),
        title: draft.title.trim(),
        text: draft.text.trim(),
        category: draft.category || null,
        kind: draft.kind || null,
        favorite: draft.favorite,
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <>
      <PageHeader
        title="Banco de Legendas"
        subtitle="Legendas prontas, organizadas e reutilizáveis para cada publicação."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setAiOpen(true)}>
              <Sparkles className="size-4" /> Gerar com IA
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setDraft(EMPTY);
                setOpen(true);
              }}
            >
              <Plus className="size-4" /> Nova legenda
            </Button>
          </div>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar legenda..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<PenLine className="size-8" />}
          title="Nenhuma legenda salva"
          description="Salve suas melhores legendas ou gere novas com o Lumina AI."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <article key={c.id} className="surface flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{c.title}</p>
                <button onClick={() => save.mutate({ id: c.id, favorite: !c.favorite })} aria-label="Favoritar">
                  <Star
                    className={cn(
                      "size-4",
                      c.favorite ? "fill-primary text-primary" : "text-muted-foreground",
                    )}
                  />
                </button>
              </div>
              <p className="line-clamp-6 flex-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {c.text}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copiar"
                  onClick={() => {
                    void navigator.clipboard.writeText(c.text);
                    toast.success("Legenda copiada!");
                  }}
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Editar"
                  onClick={() => {
                    setDraft({
                      id: c.id,
                      title: c.title,
                      text: c.text,
                      category: c.category ?? "",
                      kind: c.kind ?? "",
                      favorite: c.favorite,
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
                      <AlertDialogTitle>Excluir legenda?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(c.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar legenda" : "Nova legenda"}</DialogTitle>
            <DialogDescription>Salve textos prontos para reutilizar nos conteúdos.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                required
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Texto *</Label>
              <Textarea
                required
                rows={8}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  placeholder="Culto, evento..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Formato</Label>
                <Input
                  value={draft.kind}
                  onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                  placeholder="Reels, Feed..."
                />
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
