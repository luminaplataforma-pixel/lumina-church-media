import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Copy, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader } from "@/components/ui-bits";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBulkInsert, useDeleteRow, useRows, useSaveRow } from "@/lib/data";
import { formatDateBR, MEDIA_ROLE_LIST, MEDIA_ROLE_META, MONTHS, type MediaRole } from "@/lib/lumina";
import type { ScheduleRow, TeamMemberRow } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/escala")({
  head: () => ({
    meta: [
      { title: "Escala da Equipe — Lumina" },
      {
        name: "description",
        content:
          "Monte a escala mensal da equipe de mídia com funções, múltiplas datas e alerta de conflitos.",
      },
      { property: "og:title", content: "Escala da Equipe — Lumina" },
      { property: "og:description", content: "Escala mensal reutilizável da equipe de mídia." },
    ],
  }),
  component: Escala,
});

type MemberDraft = {
  id?: string;
  name: string;
  roles: MediaRole[];
  phone: string;
  active: boolean;
  notes: string;
};

const EMPTY_MEMBER: MemberDraft = { name: "", roles: [], phone: "", active: true, notes: "" };

function Escala() {
  const members = useRows<TeamMemberRow>("team_members", { order: "name", ascending: true });
  const schedules = useRows<ScheduleRow>("schedules", { order: "schedule_date", ascending: true });
  const saveMember = useSaveRow("team_members", "integrante");
  const removeMember = useDeleteRow("team_members", "integrante");
  
  const removeSchedule = useDeleteRow("schedules", "escala");
  const bulkSchedule = useBulkInsert("schedules", "escala");

  const [tab, setTab] = useState<"escala" | "equipe">("escala");
  const [cursor, setCursor] = useState(() => new Date());
  const [memberOpen, setMemberOpen] = useState(false);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>(EMPTY_MEMBER);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [role, setRole] = useState<MediaRole>("storymaker");
  const [timeLabel, setTimeLabel] = useState("Culto da noite");
  const [notes, setNotes] = useState("");

  const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
  const monthSchedules = (schedules.data ?? []).filter((s) => s.schedule_date.startsWith(monthKey));
  const nameOf = (id: string) => members.data?.find((m) => m.id === id)?.name ?? "Integrante";

  const grouped = useMemo(() => {
    const map = new Map<string, ScheduleRow[]>();
    for (const s of monthSchedules) {
      const arr = map.get(s.schedule_date) ?? [];
      arr.push(s);
      map.set(s.schedule_date, arr);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [monthSchedules]);

  function submitMember(e: React.FormEvent) {
    e.preventDefault();
    saveMember.mutate(
      {
        ...(memberDraft.id ? { id: memberDraft.id } : {}),
        name: memberDraft.name.trim(),
        roles: memberDraft.roles,
        phone: memberDraft.phone || null,
        active: memberDraft.active,
        notes: memberDraft.notes || null,
      },
      { onSuccess: () => setMemberOpen(false) },
    );
  }

  function submitSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!memberId || dates.length === 0) {
      toast.error("Escolha o integrante e ao menos uma data.");
      return;
    }
    const conflicts = dates.filter((d) =>
      (schedules.data ?? []).some(
        (s) => s.schedule_date === d && s.member_id === memberId && s.time_label === timeLabel,
      ),
    );
    if (conflicts.length) {
      toast.error(
        `${nameOf(memberId)} já está escalado em ${conflicts.map(formatDateBR).join(", ")}.`,
      );
      return;
    }
    bulkSchedule.mutate(
      dates.map((d) => ({
        schedule_date: d,
        member_id: memberId,
        role,
        time_label: timeLabel,
        notes: notes || null,
      })),
      {
        onSuccess: () => {
          setScheduleOpen(false);
          setDates([]);
          setNotes("");
        },
      },
    );
  }

  function duplicateMonth() {
    if (monthSchedules.length === 0) {
      toast.error("Não há escala neste mês para duplicar.");
      return;
    }
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    const rows = monthSchedules.map((s) => {
      const d = new Date(`${s.schedule_date}T00:00:00`);
      const target = new Date(next.getFullYear(), next.getMonth(), d.getDate());
      const iso = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(
        target.getDate(),
      ).padStart(2, "0")}`;
      return {
        schedule_date: iso,
        member_id: s.member_id,
        role: s.role,
        time_label: s.time_label,
        notes: s.notes,
      };
    });
    bulkSchedule.mutate(rows, {
      onSuccess: () => {
        setCursor(next);
        toast.success(`Escala copiada para ${MONTHS[next.getMonth()]}.`);
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Escala da Equipe"
        subtitle="Integrantes permanentes e escala mensal com validação de conflitos."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={duplicateMonth}>
              <Copy className="size-4" /> Duplicar mês
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setMemberDraft(EMPTY_MEMBER);
                setMemberOpen(true);
              }}
            >
              <Users className="size-4" /> Novo integrante
            </Button>
            <Button className="gap-2" onClick={() => setScheduleOpen(true)}>
              <Plus className="size-4" /> Escalar
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="escala">Escala do mês</TabsTrigger>
            <TabsTrigger value="equipe">Integrantes</TabsTrigger>
          </TabsList>
        </Tabs>
        {tab === "escala" && (
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

      {tab === "escala" &&
        (grouped.length === 0 ? (
          <EmptyState
            icon={<Users className="size-8" />}
            title="Nenhuma escala neste mês"
            description="Escale a equipe para os cultos e eventos deste mês."
            action={<Button onClick={() => setScheduleOpen(true)}>Escalar equipe</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map(([date, rows]) => (
              <section key={date} className="surface p-5">
                <h2 className="font-display font-semibold">{formatDateBR(date)}</h2>
                <ul className="mt-3 space-y-2">
                  {rows.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{nameOf(s.member_id)}</p>
                        <p className="text-xs text-muted-foreground">
                          {MEDIA_ROLE_META[s.role]} · {s.time_label}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            aria-label="Remover da escala"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover da escala?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {nameOf(s.member_id)} será removido de {formatDateBR(date)}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeSchedule.mutate(s.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))}

      {tab === "equipe" &&
        ((members.data ?? []).length === 0 ? (
          <EmptyState
            icon={<Users className="size-8" />}
            title="Nenhum integrante cadastrado"
            description="Cadastre a equipe de mídia uma única vez e reutilize em todas as escalas."
            action={
              <Button
                onClick={() => {
                  setMemberDraft(EMPTY_MEMBER);
                  setMemberOpen(true);
                }}
              >
                Cadastrar integrante
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(members.data ?? []).map((m) => (
              <article key={m.id} className="surface flex items-start justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="font-medium">{m.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.roles.length ? m.roles.map((r) => MEDIA_ROLE_META[r]).join(" · ") : "Sem função"}
                  </p>
                  {m.phone && <p className="text-xs text-muted-foreground">{m.phone}</p>}
                  {!m.active && (
                    <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs">
                      Inativo
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar"
                    onClick={() => {
                      setMemberDraft({
                        id: m.id,
                        name: m.name,
                        roles: m.roles,
                        phone: m.phone ?? "",
                        active: m.active,
                        notes: m.notes ?? "",
                      });
                      setMemberOpen(true);
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
                        <AlertDialogTitle>Excluir {m.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          As escalas deste integrante também serão removidas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeMember.mutate(m.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </article>
            ))}
          </div>
        ))}

      <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{memberDraft.id ? "Editar integrante" : "Novo integrante"}</DialogTitle>
            <DialogDescription>
              Integrantes ficam salvos e podem ser escalados em várias datas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitMember} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                required
                value={memberDraft.name}
                onChange={(e) => setMemberDraft({ ...memberDraft, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Funções na mídia</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {MEDIA_ROLE_LIST.map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={memberDraft.roles.includes(r)}
                      onCheckedChange={(v) =>
                        setMemberDraft({
                          ...memberDraft,
                          roles: v
                            ? [...memberDraft.roles, r]
                            : memberDraft.roles.filter((x) => x !== r),
                        })
                      }
                    />
                    {MEDIA_ROLE_META[r]}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input
                value={memberDraft.phone}
                onChange={(e) => setMemberDraft({ ...memberDraft, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Textarea
                rows={2}
                value={memberDraft.notes}
                onChange={(e) => setMemberDraft({ ...memberDraft, notes: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={memberDraft.active}
                onCheckedChange={(v) => setMemberDraft({ ...memberDraft, active: !!v })}
              />
              Integrante ativo
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMemberOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMember.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Escalar integrante</DialogTitle>
            <DialogDescription>
              Selecione várias datas para escalar a mesma pessoa de uma só vez.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSchedule} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Integrante *</Label>
              <Select value={memberId} onValueChange={setMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o integrante" />
                </SelectTrigger>
                <SelectContent>
                  {(members.data ?? [])
                    .filter((m) => m.active)
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Função</Label>
                <Select value={role} onValueChange={(v) => setRole(v as MediaRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_ROLE_LIST.map((r) => (
                      <SelectItem key={r} value={r}>
                        {MEDIA_ROLE_META[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Culto / horário</Label>
                <Input value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Datas *</Label>
              <div className="flex gap-2">
                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newDate && !dates.includes(newDate)) setDates([...dates, newDate].sort());
                    setNewDate("");
                  }}
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {dates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDates(dates.filter((x) => x !== d))}
                    className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-destructive/15"
                  >
                    {formatDateBR(d)} ✕
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setScheduleOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={bulkSchedule.isPending}>
                Salvar escala
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
