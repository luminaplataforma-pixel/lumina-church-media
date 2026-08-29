import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRows } from "@/lib/data";
import {
  formatDateBR,
  MEDIA_ROLE_META,
  STATUS_LIST,
  STATUS_META,
  TYPE_META,
  TYPE_LIST,
} from "@/lib/lumina";
import type { ContentRow, ScheduleRow, TeamMemberRow } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Lumina" },
      {
        name: "description",
        content: "Indicadores de produção, tipos de conteúdo e participação da equipe de mídia.",
      },
      { property: "og:title", content: "Relatórios — Lumina" },
      { property: "og:description", content: "Relatórios com filtros e exportação em CSV." },
    ],
  }),
  component: Relatorios,
});

const COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Relatorios() {
  const contents = useRows<ContentRow>("contents");
  const schedules = useRows<ScheduleRow>("schedules");
  const members = useRows<TeamMemberRow>("team_members");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("todos");

  const filtered = useMemo(
    () =>
      (contents.data ?? []).filter((c) => {
        const d = c.publish_date ?? c.created_at.slice(0, 10);
        return (
          (type === "todos" || c.type === type) && (!from || d >= from) && (!to || d <= to)
        );
      }),
    [contents.data, from, to, type],
  );

  const byStatus = STATUS_LIST.map((s) => ({
    name: STATUS_META[s].label,
    value: filtered.filter((c) => c.status === s).length,
  })).filter((x) => x.value > 0);

  const byType = TYPE_LIST.map((t) => ({
    name: TYPE_META[t],
    total: filtered.filter((c) => c.type === t).length,
  })).filter((x) => x.total > 0);

  const byMember = (members.data ?? [])
    .map((m) => ({
      name: m.name,
      total: (schedules.data ?? []).filter((s) => s.member_id === m.id).length,
    }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  const published = filtered.filter((c) => c.status === "publicado").length;
  const rate = filtered.length ? Math.round((published / filtered.length) * 100) : 0;

  function exportCsv() {
    const header = ["Título", "Tipo", "Status", "Data", "Tema"];
    const rows = filtered.map((c) => [
      c.title,
      TYPE_META[c.type],
      STATUS_META[c.status].label,
      formatDateBR(c.publish_date),
      c.theme ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumina-relatorio-conteudos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Acompanhe a produtividade e o desempenho da mídia da igreja."
        actions={
          <Button variant="outline" className="gap-2" onClick={exportCsv}>
            <Download className="size-4" /> Exportar CSV
          </Button>
        }
      />

      <div className="surface grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>De</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Até</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Conteúdos no período</p>
          <p className="mt-2 font-display text-3xl font-semibold">{filtered.length}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Publicados</p>
          <p className="mt-2 font-display text-3xl font-semibold">{published}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Taxa de conclusão</p>
          <p className="mt-2 font-display text-3xl font-semibold">{rate}%</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="font-display text-lg font-semibold">Distribuição por status</h2>
          <div className="mt-4 h-72">
            {byStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados no período.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                    {byStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="font-display text-lg font-semibold">Conteúdos por tipo</h2>
          <div className="mt-4 h-72">
            {byType.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados no período.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <section className="surface p-5">
        <h2 className="font-display text-lg font-semibold">Participação da equipe</h2>
        {byMember.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma escala registrada ainda.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {byMember.map((m) => (
              <li key={m.name} className="flex items-center justify-between text-sm">
                <span>{m.name}</span>
                <span className="text-muted-foreground">{m.total} escala(s)</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Funções consideradas: {Object.values(MEDIA_ROLE_META).join(", ")}.
        </p>
      </section>
    </>
  );
}
