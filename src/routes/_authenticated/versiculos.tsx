import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Copy, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import type { VerseRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/versiculos")({
  head: () => ({
    meta: [
      { title: "Banco de Versículos — Lumyes" },
      {
        name: "description",
        content: "Guarde e organize versículos por tema, categoria e favoritos para usar na mídia.",
      },
      { property: "og:title", content: "Banco de Versículos — Lumyes" },
      { property: "og:description", content: "Versículos organizados por tema e favoritos." },
    ],
  }),
  component: Versiculos,
});

type Draft = {
  id?: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
  theme: string;
  category: string;
  favorite: boolean;
};

const EMPTY: Draft = {
  book: "",
  chapter: "1",
  verse: "1",
  text: "",
  theme: "",
  category: "",
  favorite: false,
};

function Versiculos() {
  const { data, isLoading } = useRows<VerseRow>("verses");
  const save = useSaveRow("verses", "versículo");
  const remove = useDeleteRow("verses", "versículo");
  const [q, setQ] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (v) =>
        (!onlyFav || v.favorite) &&
        (!term ||
          v.text.toLowerCase().includes(term) ||
          v.book.toLowerCase().includes(term) ||
          (v.theme ?? "").toLowerCase().includes(term)),
    );
  }, [data, q, onlyFav]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate(
      {
        ...(draft.id ? { id: draft.id } : {}),
        book: draft.book.trim(),
        chapter: Number(draft.chapter) || 1,
        verse: draft.verse.trim() || "1",
        text: draft.text.trim(),
        theme: draft.theme || null,
        category: draft.category || null,
        favorite: draft.favorite,
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <>
      <PageHeader
        title="Banco de Versículos"
        subtitle="Sua biblioteca de textos bíblicos prontos para virar conteúdo."
        actions={
          <div className="flex gap-2">
            <Button variant={onlyFav ? "secondary" : "outline"} onClick={() => setOnlyFav((f) => !f)} className="gap-2">
              <Star className="size-4" /> Favoritos
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setDraft(EMPTY);
                setOpen(true);
              }}
            >
              <Plus className="size-4" /> Novo versículo
            </Button>
          </div>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar por texto, livro ou tema..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-8" />}
          title="Nenhum versículo salvo"
          description="Cadastre os textos que sua igreja mais usa nas publicações."
          action={
            <Button
              onClick={() => {
                setDraft(EMPTY);
                setOpen(true);
              }}
            >
              Adicionar versículo
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <article key={v.id} className="surface flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display font-semibold">
                  {v.book} {v.chapter}:{v.verse}
                </p>
                <button
                  onClick={() => save.mutate({ id: v.id, favorite: !v.favorite })}
                  aria-label="Favoritar"
                >
                  <Star
                    className={cn(
                      "size-4",
                      v.favorite ? "fill-primary text-primary" : "text-muted-foreground",
                    )}
                  />
                </button>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">“{v.text}”</p>
              {v.theme && (
                <span className="w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs">{v.theme}</span>
              )}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copiar"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `“${v.text}” — ${v.book} ${v.chapter}:${v.verse}`,
                    );
                    toast.success("Versículo copiado!");
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
                      id: v.id,
                      book: v.book,
                      chapter: String(v.chapter),
                      verse: v.verse,
                      text: v.text,
                      theme: v.theme ?? "",
                      category: v.category ?? "",
                      favorite: v.favorite,
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
                      <AlertDialogTitle>Excluir versículo?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(v.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar versículo" : "Novo versículo"}</DialogTitle>
            <DialogDescription>Informe a referência e o texto bíblico.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label>Livro *</Label>
                <Input
                  required
                  value={draft.book}
                  onChange={(e) => setDraft({ ...draft, book: e.target.value })}
                  placeholder="Salmos"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Capítulo</Label>
                <Input
                  type="number"
                  min={1}
                  value={draft.chapter}
                  onChange={(e) => setDraft({ ...draft, chapter: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Versículo</Label>
                <Input
                  value={draft.verse}
                  onChange={(e) => setDraft({ ...draft, verse: e.target.value })}
                  placeholder="1-3"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Texto *</Label>
              <Textarea
                required
                rows={4}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Tema</Label>
                <Input
                  value={draft.theme}
                  onChange={(e) => setDraft({ ...draft, theme: e.target.value })}
                  placeholder="Fé, gratidão..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  placeholder="Culto, jovens..."
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
