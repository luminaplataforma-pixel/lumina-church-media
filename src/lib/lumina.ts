export type ContentStatus =
  | "ideia"
  | "planejamento"
  | "producao"
  | "revisao"
  | "agendado"
  | "publicado"
  | "cancelado";

export type ContentType =
  | "feed"
  | "carrossel"
  | "reels"
  | "stories"
  | "culto"
  | "evento"
  | "devocional"
  | "testemunho"
  | "aviso"
  | "versiculo";

export type MediaRole = "storymaker" | "videomaker" | "fotografia" | "multimidia" | "live";
export type EventStatus = "planejado" | "confirmado" | "realizado" | "cancelado";
export type AppRole = "admin" | "editor" | "viewer" | "media" | "pastoral";

export const STATUS_META: Record<ContentStatus, { label: string; progress: number; dot: string }> = {
  ideia: { label: "Ideia", progress: 0, dot: "bg-muted-foreground" },
  planejamento: { label: "Planejamento", progress: 20, dot: "bg-chart-4" },
  producao: { label: "Produção", progress: 40, dot: "bg-chart-5" },
  revisao: { label: "Revisão", progress: 60, dot: "bg-chart-2" },
  agendado: { label: "Agendado", progress: 80, dot: "bg-primary" },
  publicado: { label: "Publicado", progress: 100, dot: "bg-success" },
  cancelado: { label: "Cancelado", progress: 0, dot: "bg-destructive" },
};

export const STATUS_LIST = Object.keys(STATUS_META) as ContentStatus[];

export const KANBAN_COLUMNS: ContentStatus[] = [
  "ideia",
  "producao",
  "revisao",
  "agendado",
  "publicado",
];

export const TYPE_META: Record<ContentType, string> = {
  feed: "Feed",
  carrossel: "Carrossel",
  reels: "Reels",
  stories: "Stories",
  culto: "Culto",
  evento: "Evento",
  devocional: "Devocional",
  testemunho: "Testemunho",
  aviso: "Aviso",
  versiculo: "Versículo",
};

export const TYPE_LIST = Object.keys(TYPE_META) as ContentType[];

export const MEDIA_ROLE_META: Record<MediaRole, string> = {
  storymaker: "StoryMaker",
  videomaker: "VideoMaker",
  fotografia: "Fotografia",
  multimidia: "Multimídia / Datashow",
  live: "Live",
};

export const MEDIA_ROLE_LIST = Object.keys(MEDIA_ROLE_META) as MediaRole[];

export const EVENT_STATUS_META: Record<EventStatus, string> = {
  planejado: "Planejado",
  confirmado: "Confirmado",
  realizado: "Realizado",
  cancelado: "Cancelado",
};

export const APP_ROLE_META: Record<AppRole, { label: string; description: string }> = {
  admin: { label: "Administrador", description: "Acesso total à plataforma." },
  editor: { label: "Editor", description: "Pode criar e editar conteúdos." },
  viewer: { label: "Visualizador", description: "Pode apenas visualizar informações." },
  media: { label: "Equipe de mídia", description: "Acesso a conteúdos e escalas." },
  pastoral: { label: "Equipe pastoral", description: "Visualiza e aprova conteúdos." },
};

export const ASSET_FOLDERS = [
  "Cultos",
  "Eventos",
  "Conferências",
  "Mulheres",
  "Jovens",
  "Missões",
  "Campanhas",
  "Outros",
];

export const CHECKLIST_ITEMS = [
  { key: "tema", label: "Tema definido" },
  { key: "arte", label: "Arte criada" },
  { key: "legenda", label: "Legenda pronta" },
  { key: "revisado", label: "Revisado" },
  { key: "aprovado", label: "Aprovado" },
  { key: "agendado", label: "Agendado" },
  { key: "publicado", label: "Publicado" },
] as const;

export function checklistProgress(checklist: Record<string, boolean> | null | undefined) {
  const c = checklist ?? {};
  const done = CHECKLIST_ITEMS.filter((i) => c[i.key]).length;
  return Math.round((done / CHECKLIST_ITEMS.length) * 100);
}

export function statusProgress(status: ContentStatus) {
  return STATUS_META[status]?.progress ?? 0;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function formatDateBR(value?: string | null) {
  if (!value) return "—";
  const [y, m, d] = value.slice(0, 10).split("-");
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d} dia${d > 1 ? "s" : ""}`;
  return `há ${Math.floor(d / 30)} mês(es)`;
}
