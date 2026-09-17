import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Command,
  Menu,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LuminaLogo } from "@/components/lumina-logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumyes — Automação inteligente para equipes que avançam" },
      {
        name: "description",
        content:
          "Centralize fluxos, colaboração e inteligência operacional em um só espaço. Lumyes transforma trabalho repetitivo em progresso mensurável.",
      },
      { property: "og:title", content: "Lumyes — Automação inteligente para equipes que avançam" },
      {
        property: "og:description",
        content: "Workflows mais inteligentes, equipes mais alinhadas e resultados que escalam.",
      },
    ],
  }),
  component: Landing,
});

const TRUSTED_LOGOS = ["Layers", "Peregrin", "Segment", "Ephemeral", "Leapyear"];

const SOLUTIONS = [
  {
    number: "01",
    title: "Sistemas de automação",
    text: "Desenhe fluxos inteligentes que reduzem tarefas manuais e mantêm toda a operação no ritmo certo.",
    icon: Workflow,
  },
  {
    number: "02",
    title: "Inteligência para decisões",
    text: "Transforme sinais espalhados em insights claros para decidir melhor, mais rápido e com contexto.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Processos que escalam",
    text: "Otimize cada etapa do trabalho, elimine gargalos e crie uma base operacional pronta para crescer.",
    icon: Network,
  },
];

const FAQS = [
  {
    question: "O que é o Lumyes e como ele funciona?",
    answer:
      "O Lumyes é um espaço operacional para conectar pessoas, processos e automações. Você organiza seus fluxos, define gatilhos e acompanha cada entrega com visibilidade em tempo real.",
  },
  {
    question: "Posso adaptar os fluxos para diferentes equipes?",
    answer:
      "Sim. Os fluxos são modulares e podem ser configurados para operações, marketing, atendimento, conteúdo ou qualquer rotina que sua equipe precise tornar mais previsível.",
  },
  {
    question: "O Lumyes substitui as ferramentas que já usamos?",
    answer:
      "Não precisa. A plataforma foi pensada para conectar o que você já usa e criar uma camada inteligente de coordenação, sem exigir uma troca radical de ferramentas.",
  },
  {
    question: "Como acompanho a performance dos processos?",
    answer:
      "Painéis, indicadores e atualizações em tempo real mostram o que está avançando, onde existem gargalos e quais automações estão gerando mais impacto.",
  },
];

const PLANS = [
  {
    name: "Essentials",
    description: "Para equipes começando a automatizar o trabalho.",
    monthly: 0,
    yearly: 0,
    features: [
      "Até 3 fluxos ativos",
      "Painel de operações",
      "Colaboração essencial",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
  },
  {
    name: "Growth",
    description: "Para times que querem velocidade e escala.",
    monthly: 49,
    yearly: 39,
    features: [
      "Fluxos ilimitados",
      "Automações com IA",
      "Analytics em tempo real",
      "Integrações avançadas",
      "Suporte prioritário",
    ],
    cta: "Começar com Growth",
    popular: true,
  },
  {
    name: "Scale",
    description: "Para operações complexas e em crescimento.",
    monthly: 129,
    yearly: 99,
    features: [
      "Tudo do Growth",
      "Workspaces ilimitados",
      "Permissões avançadas",
      "Onboarding dedicado",
      "SLA e suporte estratégico",
    ],
    cta: "Falar com especialistas",
  },
];

function Eyebrow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="section-eyebrow">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

function PrimaryCta({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link to="/auth" search={{ mode: "signup" }} className={`button-primary group ${className}`}>
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

function DashboardMockup() {
  return (
    <div className="dashboard-frame">
      <div className="dashboard-topbar">
        <div className="flex items-center gap-2.5">
          <LuminaLogo compact className="text-white" />
          <span className="dashboard-divider" />
          <span className="dashboard-muted hidden sm:inline">Operations</span>
        </div>
        <div className="dashboard-menu hidden md:flex">
          <span className="dashboard-menu-active">Overview</span>
          <span>Workflows</span>
          <span>Insights</span>
          <span>Team</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="dashboard-icon-button">
            <Command className="size-3.5" />
          </div>
          <div className="dashboard-icon-button">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-sky-400" />
            </span>
          </div>
          <div className="dashboard-avatar">MC</div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="dashboard-kicker">MONDAY, SEPTEMBER 23</p>
            <h3 className="dashboard-title">
              Welcome back, <span>Marina</span>
            </h3>
            <p className="dashboard-copy">Here&apos;s what&apos;s moving across your workspace.</p>
          </div>
          <button className="dashboard-filter">
            This month <ChevronDown className="size-3" />
          </button>
        </div>

        <div className="dashboard-kpis">
          <div>
            <span>Active workflows</span>
            <strong>24</strong>
            <em className="positive">+18.4%</em>
          </div>
          <div>
            <span>Tasks automated</span>
            <strong>1,284</strong>
            <em className="positive">+32.8%</em>
          </div>
          <div>
            <span>Time saved</span>
            <strong>78.6h</strong>
            <em className="positive">+12.6%</em>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card dashboard-chart-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="dashboard-label">WORKFLOW ACTIVITY</span>
                <h4>Momentum this month</h4>
              </div>
              <BarChart3 className="size-4 text-sky-400" />
            </div>
            <div className="chart-bars" aria-label="Workflow activity chart">
              {[36, 58, 44, 74, 52, 86, 65, 92, 70, 100, 82, 96].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="chart-labels">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>
          <div className="dashboard-card dashboard-progress-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="dashboard-label">TEAM MOMENTUM</span>
                <h4>On track</h4>
              </div>
              <span className="dashboard-status">
                <CheckCircle2 className="size-3" /> 86%
              </span>
            </div>
            <div className="ring-progress">
              <div>
                <strong>86%</strong>
                <span>completed</span>
              </div>
            </div>
            <div className="progress-meta">
              <span>24 workflows</span>
              <span>+4 this week</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card dashboard-activity-card">
          <div className="dashboard-card-heading">
            <div>
              <span className="dashboard-label">RECENT ACTIVITY</span>
              <h4>Everything in sync</h4>
            </div>
            <ArrowRight className="size-4 text-slate-500" />
          </div>
          <div className="activity-list">
            <div>
              <span className="activity-dot activity-blue" />
              <span>
                <strong>Lead qualification</strong>
                <small>Workflow completed</small>
              </span>
              <time>2m ago</time>
            </div>
            <div>
              <span className="activity-dot activity-purple" />
              <span>
                <strong>Weekly report</strong>
                <small>Insights generated</small>
              </span>
              <time>18m ago</time>
            </div>
            <div>
              <span className="activity-dot activity-green" />
              <span>
                <strong>Team stand-up</strong>
                <small>Calendar synced</small>
              </span>
              <time>42m ago</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({
  type,
  title,
  text,
}: {
  type: "automation" | "smart" | "team";
  title: string;
  text: string;
}) {
  return (
    <article className={`benefit-card benefit-${type}`}>
      <div className="benefit-art">
        {type === "automation" && (
          <div className="automation-stack">
            {[
              { icon: "✉", label: "Email automation", width: "78%" },
              { icon: "↗", label: "Real-time actions", width: "58%" },
              { icon: "✦", label: "Intelligent triggers", width: "42%" },
            ].map((row) => (
              <div className="automation-row" key={row.label}>
                <span className="automation-icon">{row.icon}</span>
                <span className="automation-text">
                  <b>{row.label}</b>
                  <i style={{ width: row.width }} />
                </span>
                <CheckCircle2 className="size-3.5 text-sky-400" />
              </div>
            ))}
          </div>
        )}
        {type === "smart" && (
          <div className="lightning-mark">
            <Zap />
          </div>
        )}
        {type === "team" && (
          <div className="team-schedule">
            {[
              { label: "Motion team", time: "12:00 am – 01:00 pm", color: "blue" },
              { label: "Development team", time: "09:00 am – 10:00 am", color: "purple" },
              { label: "Design team", time: "10:30 am – 11:30 am", color: "green" },
            ].map((row) => (
              <div className="schedule-row" key={row.label}>
                <span>
                  <b>{row.label}</b>
                  <small>{row.time}</small>
                </span>
                <div className="avatar-stack">
                  <i className={`avatar-${row.color}`}>A</i>
                  <i className="avatar-peach">J</i>
                  <i className="avatar-lilac">M</i>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="benefit-copy">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [openFaq, setOpenFaq] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <header className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <Link to="/" onClick={closeMenu} aria-label="Lumyes início">
            <LuminaLogo />
          </Link>
          <nav className="landing-nav-links" aria-label="Navegação principal">
            <a href="#benefits">Benefícios</a>
            <a href="#solutions">Soluções</a>
            <a href="#features">Features</a>
            <a href="#pricing">Planos</a>
          </nav>
          <div className="landing-nav-actions">
            <Link to="/auth" className="nav-login">
              Entrar
            </Link>
            <PrimaryCta>Começar agora</PrimaryCta>
          </div>
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#benefits" onClick={closeMenu}>
              Benefícios
            </a>
            <a href="#solutions" onClick={closeMenu}>
              Soluções
            </a>
            <a href="#features" onClick={closeMenu}>
              Features
            </a>
            <a href="#pricing" onClick={closeMenu}>
              Planos
            </a>
            <Link to="/auth" onClick={closeMenu}>
              Entrar
            </Link>
            <PrimaryCta>Começar agora</PrimaryCta>
          </div>
        )}
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-content page-width">
            <Eyebrow icon={Sparkles}>Automação inteligente para equipes</Eyebrow>
            <h1>
              Seu trabalho, <span>mais inteligente.</span>
            </h1>
            <p className="hero-description">
              Conecte pessoas, processos e IA em um só lugar para transformar tarefas repetitivas em
              progresso real.
            </p>
            <div className="hero-actions">
              <PrimaryCta>Explorar o Lumyes</PrimaryCta>
              <a className="button-secondary group" href="#how-it-works">
                <Play className="size-3.5 fill-current" /> Ver como funciona
              </a>
            </div>
            <div className="hero-note">
              <span className="note-avatars">
                <i>R</i>
                <i>C</i>
                <i>M</i>
              </span>
              <span>Confiado por equipes que fazem mais com menos.</span>
            </div>
            <div className="hero-dashboard-wrap">
              <DashboardMockup />
            </div>
          </div>
        </section>

        <section className="trust-section page-width" aria-label="Empresas que confiam no Lumyes">
          <p>Confiado por equipes de alto crescimento</p>
          <div className="trust-logos">
            {TRUSTED_LOGOS.map((logo, index) => (
              <span key={logo}>
                <i className={`trust-symbol trust-symbol-${index}`} />
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section id="benefits" className="section-block page-width">
          <div className="section-heading centered">
            <Eyebrow icon={Zap}>Benefícios</Eyebrow>
            <h2>
              O que você ganha com
              <br />
              <span>workflows inteligentes</span>
            </h2>
            <p>Menos ruído operacional. Mais tempo para o trabalho que move o negócio.</p>
          </div>
          <div className="benefit-grid">
            <BenefitCard
              type="automation"
              title="Fluxos que rodam sozinhos"
              text="Automatize tarefas e mantenha seu time sincronizado com atualizações em tempo real."
            />
            <BenefitCard
              type="smart"
              title="Decisões mais rápidas"
              text="Execute o próximo passo com contexto, inteligência e clareza em cada movimento."
            />
            <BenefitCard
              type="team"
              title="Colaboração sem atrito"
              text="Compartilhe agendas, responsabilidades e progresso sem deixar nada para trás."
            />
          </div>
        </section>

        <section id="solutions" className="solutions-section page-width">
          <div className="solutions-intro">
            <Eyebrow icon={Workflow}>O que construímos</Eyebrow>
            <h2>
              Automação para
              <br />
              <span>workflows modernos</span>
            </h2>
            <p>
              Uma camada operacional inteligente para que sua equipe avance com mais foco e menos
              fricção.
            </p>
            <PrimaryCta>Conhecer soluções</PrimaryCta>
          </div>
          <div className="solutions-list">
            {SOLUTIONS.map(({ number, title, text, icon: Icon }) => (
              <article className="solution-item" key={number}>
                <div className="solution-number">{number}</div>
                <div className="solution-content">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className="solution-art">
                    <Icon />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="features-section page-width">
          <div className="section-heading centered">
            <Eyebrow icon={Sparkles}>Features</Eyebrow>
            <h2>
              Transforme seu workflow
              <br />
              <span>com recursos inteligentes</span>
            </h2>
            <p>Um sistema simples de usar, poderoso o bastante para acompanhar o seu ritmo.</p>
          </div>
          <div className="feature-strip">
            <div className="feature-strip-glow" />
            <div className="feature-strip-content">
              <span className="feature-tag">
                <Zap className="size-3" /> Lumyes intelligence
              </span>
              <h3>Clareza para o próximo passo.</h3>
              <p>
                Veja o que importa, automatize o que trava e dê ao seu time uma visão compartilhada
                do trabalho.
              </p>
              <PrimaryCta>Ver o Lumyes em ação</PrimaryCta>
            </div>
            <div className="feature-orbit">
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />
              <div className="orbit-core">
                <Sparkles />
              </div>
              <span className="orbit-node orbit-node-one">
                <Clock3 />
              </span>
              <span className="orbit-node orbit-node-two">
                <UsersRound />
              </span>
              <span className="orbit-node orbit-node-three">
                <ShieldCheck />
              </span>
            </div>
          </div>
          <div className="mini-feature-grid">
            <article>
              <BarChart3 />
              <h3>Insights acionáveis</h3>
              <p>Indicadores que mostram onde concentrar energia.</p>
            </article>
            <article>
              <UsersRound />
              <h3>Time alinhado</h3>
              <p>Uma visão compartilhada, sem atualizações perdidas.</p>
            </article>
            <article>
              <Zap />
              <h3>Execução veloz</h3>
              <p>Automação que acontece no ritmo do seu negócio.</p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="how-section page-width">
          <div>
            <Eyebrow icon={ArrowRight}>Como funciona</Eyebrow>
            <h2>
              Do primeiro fluxo
              <br />
              <span>ao impacto mensurável.</span>
            </h2>
          </div>
          <div className="how-steps">
            <div>
              <span>01</span>
              <h3>Conecte</h3>
              <p>Traga suas ferramentas e o contexto do seu time.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Automatize</h3>
              <p>Crie regras simples para o trabalho que se repete.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Avance</h3>
              <p>Acompanhe o impacto e melhore continuamente.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section page-width">
          <div className="section-heading centered">
            <Eyebrow icon={Sparkles}>Planos</Eyebrow>
            <h2>
              Simples para começar.
              <br />
              <span>Poderoso para crescer.</span>
            </h2>
            <p>Escolha o plano certo para o momento da sua equipe. Troque quando quiser.</p>
            <div className="billing-toggle" role="group" aria-label="Periodicidade de cobrança">
              <button
                className={billing === "monthly" ? "active" : ""}
                onClick={() => setBilling("monthly")}
              >
                Mensal
              </button>
              <button
                className={billing === "yearly" ? "active" : ""}
                onClick={() => setBilling("yearly")}
              >
                Anual <span>20% off</span>
              </button>
            </div>
          </div>
          <div className="plans-grid">
            {PLANS.map((plan) => {
              const price = billing === "monthly" ? plan.monthly : plan.yearly;
              return (
                <article
                  className={`plan-card ${plan.popular ? "plan-popular" : ""}`}
                  key={plan.name}
                >
                  {plan.popular && <span className="popular-badge">Mais escolhido</span>}
                  <div className="plan-top">
                    <div>
                      <h3>{plan.name}</h3>
                      <p>{plan.description}</p>
                    </div>
                    <span className="plan-icon">
                      {plan.popular ? (
                        <Sparkles />
                      ) : plan.name === "Scale" ? (
                        <Workflow />
                      ) : (
                        <Command />
                      )}
                    </span>
                  </div>
                  <div className="plan-price">
                    <strong>{price === 0 ? "Grátis" : `$${price}`}</strong>
                    {price !== 0 && <span>/ mês</span>}
                  </div>
                  <Link
                    to="/auth"
                    search={{ mode: "signup" }}
                    className={`plan-cta ${plan.popular ? "plan-cta-primary" : ""}`}
                  >
                    {plan.cta}
                    <ArrowUpRight className="size-4" />
                  </Link>
                  <div className="plan-divider" />
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check className="size-4 text-sky-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="faq-section page-width">
          <div className="faq-heading">
            <Eyebrow icon={ShieldCheck}>Perguntas frequentes</Eyebrow>
            <h2>
              Ainda ficou
              <br />
              <span>alguma dúvida?</span>
            </h2>
            <p>Se não encontrou o que procura, nosso time está pronto para conversar.</p>
            <Link to="/auth" className="text-link">
              Falar com o time <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div className={`faq-item ${openFaq === index ? "faq-open" : ""}`} key={faq.question}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className="size-4" />
                </button>
                {openFaq === index && <p>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta page-width">
          <div className="final-cta-glow" />
          <Eyebrow icon={Sparkles}>Comece agora</Eyebrow>
          <h2>
            O próximo nível do seu
            <br />
            <span>trabalho começa aqui.</span>
          </h2>
          <p>Organize o caos, acelere o time e deixe o Lumyes cuidar do resto.</p>
          <PrimaryCta>Começar grátis</PrimaryCta>
        </section>
      </main>

      <footer className="landing-footer page-width">
        <div className="footer-main">
          <LuminaLogo />
          <div className="footer-links">
            <a href="#benefits">Benefícios</a>
            <a href="#solutions">Soluções</a>
            <a href="#pricing">Planos</a>
            <Link to="/auth">Entrar</Link>
          </div>
          <a href="#" className="back-top">
            Voltar ao topo <ArrowUpRight className="size-3.5" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lumyes. Feito para equipes que avançam.</span>
          <span>Privacidade · Termos</span>
        </div>
      </footer>
    </div>
  );
}
