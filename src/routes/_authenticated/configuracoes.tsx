import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Instagram, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { APP_ROLE_META } from "@/lib/lumina";
import { useTheme } from "@/lib/theme";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Lumyes" },
      {
        name: "description",
        content: "Ajuste os dados da igreja, seu perfil, tema e a conexão com o Instagram.",
      },
      { property: "og:title", content: "Configurações — Lumyes" },
      { property: "og:description", content: "Preferências da conta e da igreja na Lumyes." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { workspaceId, workspaceName, fullName, email, userId, roles, refresh } = useWorkspace();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [church, setChurch] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setChurch(workspaceName);
    setName(fullName);
  }, [workspaceName, fullName]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!workspaceId || !userId) return;
    setSaving(true);
    const [w, p] = await Promise.all([
      supabase.from("workspaces").update({ name: church.trim() }).eq("id", workspaceId),
      supabase.from("profiles").update({ full_name: name.trim() }).eq("id", userId),
    ]);
    setSaving(false);
    if (w.error || p.error) {
      toast.error("Não foi possível salvar as alterações.");
      return;
    }
    toast.success("Configurações atualizadas.");
    refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
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
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Conta: {email ?? "—"} · Permissões:{" "}
          {roles.length ? roles.map((r) => APP_ROLE_META[r].label).join(", ") : "—"}
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>

      <section className="surface space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Aparência</h2>
        <p className="text-sm text-muted-foreground">
          Alterne entre o modo claro e o modo escuro da Lumyes.
        </p>
        <Button type="button" variant="outline" className="gap-2" onClick={toggle}>
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        </Button>
      </section>

      <section className="surface space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Instagram className="size-5" /> Instagram
        </h2>
        <p className="text-sm text-muted-foreground">
          A conexão é feita pelo login oficial do Instagram/Meta. A Lumyes nunca pede senha, token ou
          código técnico — basta autorizar a conta da igreja.
        </p>
        <Button
          type="button"
          className="gap-2"
          onClick={() =>
            toast.info(
              "A autorização oficial da Meta é liberada após a aprovação do app da igreja. Nenhum dado técnico é necessário.",
            )
          }
        >
          <Instagram className="size-4" /> Conectar conta do Instagram
        </Button>
      </section>

      <section className="surface space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Sessão</h2>
        <Button type="button" variant="outline" className="gap-2" onClick={signOut}>
          <LogOut className="size-4" /> Sair da conta
        </Button>
      </section>
    </>
  );
}
