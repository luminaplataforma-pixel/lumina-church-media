import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runLuminaAI } from "@/lib/ai.functions";

type Mode = "legenda" | "melhorar" | "ideias" | "calendario" | "cta";

const MODES: { value: Mode; label: string; placeholder: string }[] = [
  {
    value: "legenda",
    label: "Gerar legenda",
    placeholder: "Tema: Culto de celebração de domingo sobre gratidão",
  },
  { value: "melhorar", label: "Melhorar", placeholder: "Cole aqui a legenda existente..." },
  { value: "ideias", label: "Ideias", placeholder: "Mês de missões, público jovem" },
  {
    value: "calendario",
    label: "Calendário",
    placeholder: "3 publicações por semana, cultos aos domingos e quartas, campanha de jejum",
  },
  { value: "cta", label: "CTA", placeholder: "Convite para a Conferência de Jovens" },
];

export function AIAssistant({
  trigger,
  onUse,
  defaultPrompt,
}: {
  trigger?: ReactNode;
  onUse?: (text: string) => void;
  defaultPrompt?: string;
}) {
  const call = useServerFn(runLuminaAI);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("legenda");
  const [prompt, setPrompt] = useState(defaultPrompt ?? "");
  const [tone, setTone] = useState("Acolhedor e inspirador");
  const [goal, setGoal] = useState("");
  const [format, setFormat] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const active = MODES.find((m) => m.value === mode)!;

  async function generate() {
    if (!prompt.trim()) {
      toast.error("Descreva o tema ou cole o texto antes de gerar.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await call({ data: { mode, prompt, tone, goal, format } });
      if (res.error) toast.error(res.error);
      else setResult(res.text);
    } catch {
      toast.error("Não foi possível falar com a IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" className="gap-2">
            <Sparkles className="size-4" /> Assistente Lumina AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> Assistente Lumina AI
          </DialogTitle>
          <DialogDescription>
            Gere legendas, ideias, calendários editoriais e CTAs para a mídia da sua igreja.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="flex w-full flex-wrap">
            {MODES.map((m) => (
              <TabsTrigger key={m.value} value={m.value} className="text-xs">
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Contexto</Label>
            <Textarea
              rows={4}
              value={prompt}
              placeholder={active.placeholder}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Tom</Label>
              <Input value={tone} onChange={(e) => setTone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Objetivo</Label>
              <Input
                value={goal}
                placeholder="Engajamento, convite..."
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Input
                value={format}
                placeholder="Reels, Carrossel..."
                onChange={(e) => setFormat(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={() => void generate()} disabled={loading} className="w-full gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Gerando..." : "Gerar com IA"}
          </Button>

          {result && (
            <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{result}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => {
                    void navigator.clipboard.writeText(result);
                    toast.success("Copiado!");
                  }}
                >
                  <Copy className="size-3.5" /> Copiar
                </Button>
                {onUse && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onUse(result);
                      setOpen(false);
                      toast.success("Texto aplicado.");
                    }}
                  >
                    Usar este texto
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
