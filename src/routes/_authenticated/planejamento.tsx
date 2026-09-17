import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ContentDialog } from "@/components/content-dialog";
import { PageHeader, ProgressBar, StatusPill } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRows, useSaveRow } from "@/lib/data";
import {
  formatDateBR,
  KANBAN_COLUMNS,
  monthMatrix,
  MONTHS,
  STATUS_META,
  toISODate,
  TYPE_META,
  WEEKDAYS,
  type ContentStatus,
} from "@/lib/lumina";
import type { ContentRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/planejamento")({
  head: () => ({
    meta: [
      { title: "Planejamento — Lumyes" },
      {
        name: "description",
        content: "Calendário, lista, timeline e kanban do planejamento de conteúdo da igreja.",
      },
      { property: "og:title", content: "Planejamento — Lumyes" },
      { property: "og:description", content: "Calendário editorial e kanban com arrastar e soltar." },
    ],
  }),
  component: Planejamento,
});

type View = "calendario" | "lista" | "timeline" | "kanban";

function Planejamento() {
  const { data } = useRows<ContentRow>("contents");
  const save = useSaveRow("contents", "conteúdo");
  const [view, setView] = useState<View>("calendario");
  const [cursor, setCursor] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentRow | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();
  const [dragId, setDragId] = useState<string | null>(null);

  const list = data ?? [];
  const days = useMemo(
    () => monthMatrix(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );
  const today = toISODate(new Date());

  function openNew(date?: string) {
    setEditing(null);
    setDefaultDate(date);
    setOpen(true);
  }
  function openEdit(c: ContentRow) {
    setEditing(c);
    setDefaultDate(undefined);
    setOpen(true);
  }

  const monthList = list
    .filter((c) => {
      if (!c.publish_date) return false;
      const d = new Date(`${c.publish_date}T00:00:00`);
      return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
    })
    .sort((a, b) => (a.publish_date ?? "").localeCompare(b.publish_date ?? ""));

  return (
    <>
      <PageHeader
        title="Planejamento"
        subtitle="Organize o calendário editorial da mídia da igreja."
        actions={
          <Button className="gap-2" onClick={() => openNew()}>
            <Plus className="size-4" /> Novo conteúdo
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as View)}>
          <TabsList>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>
        </Tabs>

        {view !== "kanban" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[160px] text-center text-sm font-medium">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {view === "calendario" && (
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-muted/50">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d) => {
              const iso = toISODate(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const items = list.filter((c) => c.publish_date === iso);
              return (
                <div
                  key={iso}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragId) save.mutate({ id: dragId, publish_date: iso });
                    setDragId(null);
                  }}
                  className={cn(
                    "min-h-[110px] border-b border-r border-border p-1.5",
                    !inMonth && "bg-muted/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid size-6 place-items-center rounded-full text-xs",
                        iso === today
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {d.getDate()}
                    </span>
                    <button
                      className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                      onClick={() => openNew(iso)}
                      aria-label="Adicionar conteúdo"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="mt-1 space-y-1">
                    {items.map((c) => (
                      <button
                        key={c.id}
                        draggable
                        onDragStart={() => setDragId(c.id)}
                        onClick={() => openEdit(c)}
                        className="flex w-full items-center gap-1 truncate rounded-md bg-muted px-1.5 py-1 text-left text-[11px] hover:bg-accent"
                      >
                        <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_META[c.status].dot)} />
                        <span className="truncate">{c.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "lista" && (
        <div className="surface divide-y divide-border">
          {monthList.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">Nenhum conteúdo neste mês.</p>
          )}
          {monthList.map((c) => (
            <button
              key={c.id}
              onClick={() => openEdit(c)}
              className="flex w-full items-center gap-4 p-4 text-left hover:bg-accent/50"
            >
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                {formatDateBR(c.publish_date)}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{c.title}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {TYPE_META[c.type]}
              </span>
              <StatusPill status={c.status} />
            </button>
          ))}
        </div>
      )}

      {view === "timeline" && (
        <div className="surface p-6">
          {monthList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum conteúdo neste mês.</p>
          ) : (
            <ol className="relative space-y-6 border-l border-border pl-6">
              {monthList.map((c) => (
                <li key={c.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[29px] top-1.5 size-3 rounded-full ring-4 ring-background",
                      STATUS_META[c.status].dot,
                    )}
                  />
                  <button onClick={() => openEdit(c)} className="w-full text-left">
                    <p className="text-xs text-muted-foreground">{formatDateBR(c.publish_date)}</p>
                    <p className="font-medium">{c.title}</p>
                    <div className="mt-2 max-w-sm">
                      <ProgressBar value={STATUS_META[c.status].progress} />
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {view === "kanban" && (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {KANBAN_COLUMNS.map((col) => {
            const items = list.filter((c) => c.status === col);
            return (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) save.mutate({ id: dragId, status: col as ContentStatus });
                  setDragId(null);
                }}
                className="flex min-h-[220px] flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{STATUS_META[col].label}</p>
                  <span className="rounded-full bg-background px-2 text-xs text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                {items.map((c) => (
                  <button
                    key={c.id}
                    draggable
                    onDragStart={() => setDragId(c.id)}
                    onClick={() => openEdit(c)}
                    className="surface w-full space-y-2 p-3 text-left transition-shadow hover:shadow-lift"
                  >
                    <p className="line-clamp-2 text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {TYPE_META[c.type]} · {formatDateBR(c.publish_date)}
                    </p>
                    <ProgressBar value={STATUS_META[c.status].progress} />
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <ContentDialog
        open={open}
        onOpenChange={setOpen}
        content={editing}
        defaultDate={defaultDate}
      />
    </>
  );
}
