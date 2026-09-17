import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { completeInstagramAuth } from "@/lib/instagram.functions";
import { supabase } from "@/integrations/supabase/client";
import { LuminaLogo } from "@/components/lumina-logo";

type Search = { code?: string; state?: string; error_description?: string; error?: string };

export const Route = createFileRoute("/auth/meta/callback")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): Search => ({
    code: typeof search['code'] === "string" ? search['code'] : undefined,
    state: typeof search['state'] === "string" ? search['state'] : undefined,
    error: typeof search['error'] === "string" ? search['error'] : undefined,
    error_description:
      typeof search['error_description'] === "string" ? search['error_description'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Conectando o Instagram — Lumyes" },
      {
        name: "description",
        content: "Finalizando a autorização oficial da conta do Instagram da sua igreja na Lumyes.",
      },
      { property: "og:title", content: "Conectando o Instagram — Lumyes" },
      { property: "og:description", content: "Autorização oficial Meta concluída com segurança." },
    ],
  }),
  component: MetaCallback,
});

function MetaCallback() {
  const { code, state, error, error_description } = Route.useSearch();
  const navigate = useNavigate();
  const complete = useServerFn(completeInstagramAuth);
  const started = useRef(false);
  const [message, setMessage] = useState("Finalizando a conexão com o Instagram...");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      if (error || !code || !state) {
        setMessage(error_description ?? "A autorização foi cancelada.");
        toast.error(error_description ?? "A autorização foi cancelada.");
        setTimeout(() => navigate({ to: "/configuracoes", replace: true }), 1500);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const res = await complete({ data: { code, state } });
      if (res.ok) {
        toast.success(`Instagram conectado: @${res.username}`);
      } else {
        toast.error(res.error ?? "Não foi possível conectar a conta.");
        setMessage(res.error ?? "Não foi possível conectar a conta.");
      }
      navigate({ to: "/configuracoes", replace: true });
    })();
  }, [code, state, error, error_description, complete, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <LuminaLogo />
      <h1 className="font-display text-xl font-semibold">Conectando sua conta</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </main>
  );
}
