import { createFileRoute } from "@tanstack/react-router";
import { Instagram, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Lumina" },
      {
        name: "description",
        content: "Ajuste os dados da igreja, seu perfil, tema e a conexão com o Instagram.",
      },
      { property: "og:title", content: "Configurações — Lumina" },
      { property: "og:description", content: "Preferências da conta e da igreja na Lumina." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { workspace, profile, refresh, signOut } = useWorkspace();
  const { theme, setTheme } = useTheme();
  const [church, setChurch] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setChurch(workspace?.name ?? "");
    setFullName(profile?.full_name ?? "");
  }, [workspace?.name, profile?.full_name]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!workspace || !profile) return;
    setSaving(true);
    const [w, p] = await Promise.all([
      supabase.from("workspaces").update({ name: church.trim() }).eq("id", workspace.id),
      supabase.from("profiles").update({ full_name: fullName.trim() }).eq("id", profile.id),
    ]);
    setSaving(false);
    if (w.error || p.error) {
      toast.error("Não foi possível salvar as alterações.");
      return;
    }
    toast.success("Configurações atualizadas.");
    await refresh();
  }

  return (
    <>
      <PageHeader title="Configurações" subtitle="Dados da igreja, perfil, aparência e integrações." />

      <form onSubmit={save} className="surface space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Igreja e perfil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Nome da igreja</Label>
            <Input value={church} onChange={(e) => setChurch(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Seu nome</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>

      <section className="surface space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Aparência</h2>
        <p className="text-sm text-muted-foreground">
          Escolha entre o modo claro e o modo escuro da Lumina.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={theme === "light" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setTheme("light")}
          >
            <Sun className="size-4" /> Claro
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setTheme("dark")}
          >
            <Moon className="size-4" /> Escuro
          </Button>
        </div>
      </section>

      <section className="surface space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Instagram className="size-5" /> Instagram
        </h2>
        <p className="text-sm text-muted-foreground">
          A conexão é feita pelo login oficial do Instagram/Meta. A Lumina nunca pede senha, token ou
          código técnico — basta autorizar a conta da igreja.
        </p>
        <Button
          type="button"
          className="gap-2"
          onClick={() =>
            toast.info(
              "A autorização oficial da Meta será liberada assim que o app da igreja for aprovado. Nenhum dado técnico é necessário.",
            )
          }
        >
          <Instagram className="size-4" /> Conectar conta do Instagram
        </Button>
      </section>

      <section className="surface space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Sessão</h2>
        <Button type="button" variant="outline" className="gap-2" onClick={() => signOut()}>
          <LogOut className="size-4" /> Sair da conta
        </Button>
      </section>
    </>
  );
}
