import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Users,
} from "lucide-react";
import { LuminaLogo } from "@/components/lumina-logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumyes — O sistema operacional da mídia da sua igreja" },
      {
        name: "description",
        content:
          "Planeje, produza, escale e analise toda a comunicação da sua igreja em um só lugar: calendário editorial, kanban, artes, versículos, legendas, escala da equipe e Instagram.",
      },
      { property: "og:title", content: "Lumyes — Gestão de mídia para igrejas" },
      {
        property: "og:description",
        content:
          "Planejar, criar, produzir, revisar, escalar, publicar e analisar — tudo dentro do Lumyes.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Planejamento editorial",
    text: "Calendário, lista, timeline e kanban com drag & drop e status automático.",
  },
  {
    icon: Sparkles,
    title: "Lumyes AI",
    text: "Legendas, ideias, CTAs e calendários editoriais gerados para a sua igreja.",
  },
  {
    icon: ImageIcon,
    title: "Biblioteca de artes",
    text: "Upload direto do dispositivo, pastas, preview real e busca instantânea.",
  },
  {
    icon: Users,
    title: "Escala da equipe",
    text: "Cadastro permanente de integrantes, múltiplas datas e alerta de conflitos.",
  },
  {
    icon: BarChart3,
    title: "Indicadores e Instagram",
    text: "Taxa de conclusão, desempenho mensal e insights do perfil da igreja.",
  },
  {
    icon: CheckCircle2,
    title: "Checklist de produção",
    text: "Progresso automático de cada conteúdo, da ideia até a publicação.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <LuminaLogo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/auth" search={{ mode: "signup" }}>
              Começar grátis
            </Link>
          </Button>
        </div>
      </header>

      <section className="bg-lumyes-glow">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" /> Plataforma de mídia para igrejas
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            O sistema operacional da equipe de mídia da sua igreja
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Planejar → Criar → Produzir → Revisar → Escalar → Publicar → Analisar. Tudo em um único
            ambiente, sem planilhas, sem grupos perdidos no WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Criar conta da igreja
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-semibold">Tudo que a mídia da igreja precisa</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="surface p-6 transition-shadow hover:shadow-lift">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary-foreground">
                <Icon className="size-5 text-foreground" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row">
          <LuminaLogo />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lumyes. Feito para a comunicação do Reino.
          </p>
        </div>
      </footer>
    </div>
  );
}
