import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  mode: z.enum(["legenda", "melhorar", "ideias", "calendario", "cta"]),
  prompt: z.string().min(1).max(4000),
  tone: z.string().max(120).optional(),
  goal: z.string().max(240).optional(),
  format: z.string().max(120).optional(),
});

const SYSTEM: Record<string, string> = {
  legenda:
    "Você é o Lumina AI, assistente de comunicação de igrejas. Escreva legendas prontas para publicar, em português do Brasil, com gancho inicial forte, corpo objetivo, CTA claro e 5 a 8 hashtags relevantes. Nada de explicações extras.",
  melhorar:
    "Você é o Lumina AI. Reescreva a legenda enviada corrigindo gramática, melhorando clareza, ritmo, estrutura e CTA. Devolva apenas a legenda final e, ao fim, 3 bullets curtos com o que melhorou.",
  ideias:
    "Você é o Lumina AI. Gere 8 ideias de conteúdo para a mídia de uma igreja, cada uma com título, formato (Reels/Stories/Carrossel/Post), objetivo e primeira frase de gancho. Use lista numerada.",
  calendario:
    "Você é o Lumina AI. Monte um calendário editorial de 4 semanas para a mídia de uma igreja. Para cada semana, liste os dias com: tipo de conteúdo, tema, objetivo e canal. Formato em lista organizada por semana.",
  cta: "Você é o Lumina AI. Gere 10 chamadas para ação (CTA) curtas e criativas em português do Brasil para o contexto informado, variando entre comentário, compartilhamento, salvamento, presença no culto e evangelismo.",
};

export const runLuminaAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { text: "", error: "IA indisponível no momento." };

    const details = [
      data.tone ? `Tom desejado: ${data.tone}.` : "",
      data.goal ? `Objetivo: ${data.goal}.` : "",
      data.format ? `Tipo de publicação: ${data.format}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          messages: [
            { role: "system", content: SYSTEM[data.mode] ?? SYSTEM['legenda'] },
            { role: "user", content: `${data.prompt}\n\n${details}`.trim() },
          ],
        }),
      });

      if (res.status === 429)
        return { text: "", error: "Limite de uso da IA atingido. Tente novamente em instantes." };
      if (res.status === 402)
        return { text: "", error: "Créditos de IA esgotados. Recarregue para continuar." };
      if (!res.ok) return { text: "", error: "A IA não conseguiu responder agora." };

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return { text: json.choices?.[0]?.message?.content ?? "", error: null as string | null };
    } catch {
      return { text: "", error: "Falha de conexão com a IA." };
    }
  });
