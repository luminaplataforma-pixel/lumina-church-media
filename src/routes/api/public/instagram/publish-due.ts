import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

export const Route = createFileRoute("/api/public/instagram/publish-due")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) return unauthorized;

        const { publishDuePosts } = await import("@/lib/instagram-publish.server");
        try {
          const results = await publishDuePosts();
          return Response.json({ ok: true, processed: results.length, results });
        } catch (e) {
          console.error("[instagram] fila de publicação falhou", e);
          return Response.json({ ok: false, error: (e as Error).message }, { status: 500 });
        }
      },
    },
  },
});
