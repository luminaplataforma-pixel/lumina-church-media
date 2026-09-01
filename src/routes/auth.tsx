import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LuminaLogo } from "@/components/lumina-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "signup" | "reset";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: { mode?: string }) => ({
    mode: (search.mode === "signup" ? "signup" : "signin") as Mode,
  }),
  head: () => ({
    meta: [
      { title: "Entrar no Lumina — Gestão de mídia para igrejas" },
      {
        name: "description",
        content: "Acesse a plataforma Lumina para gerenciar o planejamento e a mídia da sua igreja.",
      },
      { property: "og:title", content: "Entrar no Lumina" },
      { property: "og:description", content: "Acesse a plataforma de mídia da sua igreja." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [church, setChurch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/dashboard", replace: true });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName, church_name: church },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode acessar.");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Enviamos um e-mail com o link de recuperação.");
        setMode("signin");
      }
    } catch (err) {
      toast.error((err as Error).message || "Não foi possível concluir.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 lg:flex">
        <LuminaLogo />
        <div>
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            Toda a comunicação da sua igreja, organizada em um só lugar.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Planejamento, artes, versículos, legendas, eventos, escala da equipe e indicadores — com
            o Assistente Lumina AI ao seu lado.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lumina</p>
      </div>

      <div className="flex items-center justify-center bg-lumina-glow px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <LuminaLogo />
          </div>
          <div className="surface p-7">
            <Tabs value={mode === "reset" ? "signin" : mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" />
              <TabsContent value="signup" />
            </Tabs>

            <h1 className="mt-6 text-xl font-semibold">
              {mode === "signup"
                ? "Criar conta da igreja"
                : mode === "reset"
                  ? "Recuperar senha"
                  : "Acessar o Lumina"}
            </h1>

            <form onSubmit={(e) => void submit(e)} className="mt-5 space-y-4">
              {mode === "signup" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Seu nome</Label>
                    <Input
                      id="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex.: Ana Souza"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="church">Nome da igreja</Label>
                    <Input
                      id="church"
                      required
                      value={church}
                      onChange={(e) => setChurch(e.target.value)}
                      placeholder="Ex.: Igreja Vida Nova"
                    />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@igreja.com"
                />
              </div>
              {mode !== "reset" && (
                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                  />
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                {mode === "signup" ? "Criar conta" : mode === "reset" ? "Enviar link" : "Entrar"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" className="w-full" onClick={() => void google()}>
              Continuar com Google
            </Button>

            <div className="mt-5 flex justify-between text-sm">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setMode(mode === "reset" ? "signin" : "reset")}
              >
                {mode === "reset" ? "Voltar ao login" : "Esqueci minha senha"}
              </button>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
