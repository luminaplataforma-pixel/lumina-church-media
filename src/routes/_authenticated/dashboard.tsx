import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  FileText,
  Instagram,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState, PageHeader, ProgressBar, StatusPill } from "@/components/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";
import { useRows } from "@/lib/data";
import {
  formatDateBR,
  greeting,
  MEDIA_ROLE_META,
  STATUS_META,
  STATUS_LIST,
  timeAgo,
  toISODate,
  TYPE_META,
} from "@/lib/lumina";
import type {
  ActivityRow,
  ContentRow,
  EventRow,
  InsightRow,
  ScheduleRow,
  TeamMemberRow,
} from "@/lib/types";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Lumyes" },
      {
        name: "description",
        content: "Visão geral da mídia da igreja: indicadores, pendências, escala e Instagram.",
      },
      { property: "og:title", content: "Dashboard — Lumyes" },
      { property: "og:description", content: "Indicadores e pendências da equipe de mídia." },
    ],
  }),
  component: Dashboard,
});

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  to,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof FileText;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="surface group p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Link>
  );
}

function Dashboard() {
  const { fullName, loading } = useWorkspace();
  const contents = useRows<ContentRow>("contents");
  const events = useRows<EventRow>("events", { order: "event_date", ascending: true });
  const schedules = useRows<ScheduleRow>("schedules", { order: "schedule_date", ascending: true });
  const members = useRows<TeamMemberRow>("team_members", { order: "name", ascending: true });
  const activities = useRows<ActivityRow>("activities", { limit: 8 });
  const insights = useRows<InsightRow>("instagram_insights", {
    order: "metric_date",
    ascending: true,
  });

  const today = toISODate(new Date());
  const list = contents.data ?? [];
  const published = list.filter((c) => c.status === "publicado").length;
  const pending = list.filter(
    (c) => c.publish_date && c.publish_date < today && c.status !== "publicado" && c.status !== "cancelado",
  );
  const upcoming = list
    .filter((c) => c.publish_date && c.publish_date >= today && c.status !== "publicado")
    .sort((a, b) => (a.publish_date ?? "").localeCompare(b.publish_date ?? ""))
    .slice(0, 5);
  const nextEvents = (events.data ?? []).filter((e) => e.event_date >= today).slice(0, 5);
  const todaySchedule = (schedules.data ?? []).filter((s) => s.schedule_date === today);
  const memberName = (id: string) => members.data?.find((m) => m.id === id)?.name ?? "Integrante";

  const statusChart = STATUS_LIST.filter((s) => s !== "cancelado").map((s) => ({
    name: STATUS_META[s].label,
    total: list.filter((c) => c.status === s).length,
  }));

  const insightChart = (insights.data ?? []).slice(-14).map((i) => ({
    date: i.metric_date.slice(8, 10) + "/" + i.metric_date.slice(5, 7),
    Alcance: i.reach,
    Engajamento: i.engagement,
  }));

  const completion = list.length ? Math.round((published / list.length) * 100) : 0;

  if (loading || contents.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${fullName?.split(" ")[0] || "equipe"}!`}
        subtitle="Este é o panorama da comunicação da sua igreja hoje."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Conteúdos ativos"
          value={list.filter((c) => c.status !== "publicado" && c.status !== "cancelado").length}
          hint={`${list.length} no total`}
          icon={FileText}
          to="/planejamento"
        />
        <Kpi
          label="Publicados"
          value={published}
          hint={`${completion}% de conclusão`}
          icon={CheckCircle2}
          to="/planejamento"
        />
        <Kpi
          label="Próximos eventos"
          value={nextEvents.length}
          hint="Agenda da igreja"
          icon={CalendarRange}
          to="/eventos"
        />
        <Kpi
          label="Equipe de mídia"
          value={(members.data ?? []).filter((m) => m.active).length}
          hint="Integrantes ativos"
          icon={Users}
          to="/escala"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Conteúdos por status</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <AlertTriangle className="size-4 text-destructive" /> Pendências
          </h2>
          {pending.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhuma pendência atrasada. Ótimo trabalho!
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.slice(0, 6).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Previsto para {formatDateBR(c.publish_date)}
                    </p>
                  </div>
                  <StatusPill status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-5">
          <h2 className="font-display text-lg font-semibold">Próximos conteúdos</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              title="Nada agendado"
              description="Crie um conteúdo para começar o planejamento."
            />
          ) : (
            <ul className="mt-4 space-y-4">
              {upcoming.map((c) => (
                <li key={c.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDateBR(c.publish_date)}
                    </span>
                  </div>
                  <ProgressBar value={STATUS_META[c.status].progress} />
                  <p className="text-xs text-muted-foreground">{TYPE_META[c.type]}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="font-display text-lg font-semibold">Próximos eventos</h2>
          {nextEvents.length === 0 ? (
            <EmptyState title="Sem eventos" description="Cadastre os cultos e eventos da igreja." />
          ) : (
            <ul className="mt-4 space-y-3">
              {nextEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateBR(e.event_date)} {e.event_time?.slice(0, 5) ?? ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="font-display text-lg font-semibold">Escala de hoje</h2>
          {todaySchedule.length === 0 ? (
            <EmptyState title="Ninguém escalado hoje" description="Monte a escala do mês." />
          ) : (
            <ul className="mt-4 space-y-3">
              {todaySchedule.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{memberName(s.member_id)}</p>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                    {MEDIA_ROLE_META[s.role]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Instagram className="size-4" /> Instagram Insights
          </h2>
          {insightChart.length === 0 ? (
            <EmptyState
              title="Instagram ainda não conectado"
              description="Conecte o perfil da igreja em Configurações para acompanhar alcance e engajamento."
              action={
                <Link to="/configuracoes" className="text-sm font-medium text-foreground underline">
                  Ir para Configurações
                </Link>
              }
            />
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insightChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Alcance"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Engajamento"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Activity className="size-4" /> Atividades recentes
          </h2>
          {(activities.data ?? []).length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {(activities.data ?? []).map((a) => (
                <li key={a.id} className="text-sm">
                  <span className="font-medium">{a.actor_name || "Alguém"}</span>{" "}
                  <span className="text-muted-foreground">
                    {a.action} {a.entity} {a.entity_title ? `“${a.entity_title}”` : ""}
                  </span>
                  <p className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
