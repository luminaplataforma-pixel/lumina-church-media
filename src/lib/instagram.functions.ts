import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SCOPES = [
  "instagram_business_basic",
  "instagram_business_content_publish",
  "instagram_business_manage_insights",
  "instagram_business_manage_comments",
].join(",");

async function workspaceOf(supabase: { rpc: (fn: string) => Promise<{ data: unknown }> }) {
  const { data } = await supabase.rpc("current_workspace_id");
  return (data as string | null) ?? null;
}

/** Step 1 — builds the official Meta authorization URL. */
export const getInstagramAuthUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ origin: z.string().url() }).parse(data))
  .handler(async ({ data, context }) => {
    const clientId = process.env['META_APP_ID'];
    if (!clientId) {
      return { url: null, error: "A conexão com o Instagram ainda não foi configurada." };
    }
    const workspaceId = await workspaceOf(context.supabase);
    if (!workspaceId) return { url: null, error: "Workspace não encontrado." };

    const redirectUri = `${data.origin.replace(/\/$/, "")}/auth/meta/callback`;
    const state = crypto.randomUUID();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("social_oauth_states").insert({
      state,
      workspace_id: workspaceId,
      user_id: context.userId,
      redirect_uri: redirectUri,
    });
    if (error) return { url: null, error: "Não foi possível iniciar a autorização." };

    const url = new URL("https://www.instagram.com/oauth/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", SCOPES);
    url.searchParams.set("state", state);
    return { url: url.toString(), error: null as string | null };
  });

/** Step 2 — exchanges the authorization code on the server and stores the token securely. */
export const completeInstagramAuth = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ code: z.string().min(1), state: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { exchangeCodeForToken, toLongLivedToken, fetchProfile } = await import("./instagram.server");

    const { data: stateRow } = await supabaseAdmin
      .from("social_oauth_states")
      .select("*")
      .eq("state", data.state)
      .maybeSingle();
    if (!stateRow || stateRow.user_id !== context.userId) {
      return { ok: false, error: "Autorização inválida ou expirada. Tente conectar novamente." };
    }
    await supabaseAdmin.from("social_oauth_states").delete().eq("state", data.state);

    try {
      const short = await exchangeCodeForToken(data.code, stateRow.redirect_uri);
      const long = await toLongLivedToken(short.access_token);
      const profile = await fetchProfile(long.access_token);
      const igUserId = String(profile.user_id ?? profile.id ?? short.user_id);

      const { data: account, error } = await supabaseAdmin
        .from("social_accounts")
        .upsert(
          {
            workspace_id: stateRow.workspace_id,
            user_id: context.userId,
            platform: "instagram",
            instagram_user_id: igUserId,
            username: profile.username,
            account_type: profile.account_type ?? null,
            token_expires_at: new Date(Date.now() + long.expires_in * 1000).toISOString(),
            connected_at: new Date().toISOString(),
            status: "connected",
            error_message: null,
          },
          { onConflict: "workspace_id,platform,instagram_user_id" },
        )
        .select("id")
        .single();
      if (error) throw error;

      await supabaseAdmin
        .from("social_account_secrets")
        .upsert({ account_id: account.id, access_token: long.access_token, updated_at: new Date().toISOString() });

      // keep the legacy dashboard table in sync
      await supabaseAdmin.from("instagram_accounts").upsert(
        {
          workspace_id: stateRow.workspace_id,
          username: profile.username,
          ig_user_id: igUserId,
          status: "connected",
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

      return { ok: true, username: profile.username, error: null as string | null };
    } catch (e) {
      console.error("[instagram] conexão falhou", e);
      return { ok: false, error: (e as Error).message };
    }
  });

/** Current connection state for the church. */
export const getInstagramStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("social_accounts")
      .select("id, username, account_type, status, connected_at, last_sync_at, token_expires_at, instagram_user_id")
      .eq("platform", "instagram")
      .order("connected_at", { ascending: false });
    if (error) throw error;
    return { accounts: data ?? [], configured: !!process.env['META_APP_ID'] };
  });

/** Pulls profile, recent media and insights from the official API. */
export const syncInstagram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ accountId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: owned } = await context.supabase
      .from("social_accounts")
      .select("id, workspace_id")
      .eq("id", data.accountId)
      .maybeSingle();
    if (!owned) return { ok: false, error: "Conta não encontrada." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { loadAccountToken } = await import("./instagram-publish.server");
    const { fetchMedia, fetchInsights, fetchProfile } = await import("./instagram.server");

    try {
      const account = await loadAccountToken(data.accountId);
      const profile = await fetchProfile(account.token);
      const media = await fetchMedia(account.token);

      for (const m of media.data ?? []) {
        await supabaseAdmin.from("instagram_media").upsert(
          {
            workspace_id: owned.workspace_id,
            caption: m.caption ?? "",
            media_type: m.media_type ?? "IMAGE",
            thumbnail_url: m.thumbnail_url ?? m.media_url ?? null,
            engagement: (m.like_count ?? 0) + (m.comments_count ?? 0),
            posted_at: m.timestamp ? m.timestamp.slice(0, 10) : null,
          },
          { onConflict: "id", ignoreDuplicates: true },
        );
      }

      let insightsError: string | null = null;
      try {
        const insights = await fetchInsights(account.token);
        const value = (name: string) =>
          insights.data.find((d) => d.name === name)?.total_value?.value ?? 0;
        await supabaseAdmin.from("instagram_insights").insert({
          workspace_id: owned.workspace_id,
          metric_date: new Date().toISOString().slice(0, 10),
          followers: profile.followers_count ?? 0,
          reach: value("reach"),
          engagement: value("accounts_engaged"),
          likes: value("likes"),
          comments: value("comments"),
          shares: value("shares"),
          saves: value("saves"),
          views: value("views"),
          profile_visits: value("profile_views"),
        });
      } catch (e) {
        insightsError = (e as Error).message;
      }

      await supabaseAdmin
        .from("social_accounts")
        .update({
          last_sync_at: new Date().toISOString(),
          username: profile.username,
          account_type: profile.account_type ?? null,
          status: "connected",
          error_message: insightsError,
        })
        .eq("id", data.accountId);

      return { ok: true, media: media.data?.length ?? 0, error: insightsError };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  });

/** Removes the connection and deletes the stored authorization. */
export const disconnectInstagram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ accountId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: owned } = await context.supabase
      .from("social_accounts")
      .select("id")
      .eq("id", data.accountId)
      .maybeSingle();
    if (!owned) return { ok: false, error: "Conta não encontrada." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("social_account_secrets").delete().eq("account_id", data.accountId);
    await supabaseAdmin.from("social_accounts").delete().eq("id", data.accountId);
    return { ok: true, error: null as string | null };
  });

/** Publishes a scheduled post immediately. */
export const publishNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ postId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: owned } = await context.supabase
      .from("scheduled_posts")
      .select("id")
      .eq("id", data.postId)
      .maybeSingle();
    if (!owned) return { ok: false, error: "Publicação não encontrada." };

    const { publishScheduledPostById } = await import("./instagram-publish.server");
    try {
      const out = await publishScheduledPostById(data.postId);
      return { ok: true, permalink: out.permalink ?? null, error: null as string | null };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  });
