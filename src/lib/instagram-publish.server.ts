import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  createMediaContainer,
  publishContainer,
  refreshLongLivedToken,
  waitForContainer,
} from "./instagram.server";

export type AccountWithToken = {
  id: string;
  workspace_id: string;
  instagram_user_id: string | null;
  username: string;
  token: string;
};

/** Loads the account token, refreshing it when it is close to expiring. */
export async function loadAccountToken(accountId: string): Promise<AccountWithToken> {
  const { data: account, error } = await supabaseAdmin
    .from("social_accounts")
    .select("id, workspace_id, instagram_user_id, username, token_expires_at, status")
    .eq("id", accountId)
    .maybeSingle();
  if (error) throw error;
  if (!account) throw new Error("Conta do Instagram não encontrada.");

  const { data: secret, error: secretError } = await supabaseAdmin
    .from("social_account_secrets")
    .select("access_token")
    .eq("account_id", accountId)
    .maybeSingle();
  if (secretError) throw secretError;
  if (!secret) throw new Error("A autorização do Instagram não está mais disponível. Conecte novamente.");

  let token = secret.access_token;
  const expires = account.token_expires_at ? new Date(account.token_expires_at).getTime() : 0;
  if (expires && expires - Date.now() < 7 * 24 * 60 * 60 * 1000) {
    try {
      const refreshed = await refreshLongLivedToken(token);
      token = refreshed.access_token;
      await supabaseAdmin
        .from("social_account_secrets")
        .update({ access_token: token, updated_at: new Date().toISOString() })
        .eq("account_id", accountId);
      await supabaseAdmin
        .from("social_accounts")
        .update({
          token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
          status: "connected",
          error_message: null,
        })
        .eq("id", accountId);
    } catch (e) {
      await supabaseAdmin
        .from("social_accounts")
        .update({ status: "expired", error_message: (e as Error).message })
        .eq("id", accountId);
      throw e;
    }
  }

  return {
    id: account.id,
    workspace_id: account.workspace_id,
    instagram_user_id: account.instagram_user_id,
    username: account.username,
    token,
  };
}

/** Publishes one scheduled post. Returns the published media id. */
export async function publishScheduledPostById(postId: string) {
  const { data: post, error } = await supabaseAdmin
    .from("scheduled_posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();
  if (error) throw error;
  if (!post) throw new Error("Publicação agendada não encontrada.");
  if (post.status === "publicado") return { mediaId: post.ig_media_id, permalink: post.permalink };
  if (!post.account_id) throw new Error("Nenhuma conta do Instagram vinculada a esta publicação.");

  await supabaseAdmin.from("scheduled_posts").update({ status: "publicando", error_message: null }).eq("id", postId);

  try {
    const account = await loadAccountToken(post.account_id);
    const igId = account.instagram_user_id ?? "me";
    const creationId = await createMediaContainer(igId, account.token, {
      mediaUrl: post.media_url,
      caption: post.caption ?? "",
      mediaType: post.media_type,
    });
    await waitForContainer(creationId, account.token);
    const published = await publishContainer(igId, account.token, creationId);

    await supabaseAdmin
      .from("scheduled_posts")
      .update({
        status: "publicado",
        ig_creation_id: creationId,
        ig_media_id: published.mediaId,
        permalink: published.permalink,
        published_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", postId);

    if (post.content_id) {
      await supabaseAdmin.from("contents").update({ status: "publicado" }).eq("id", post.content_id);
    }
    return published;
  } catch (e) {
    const message = (e as Error).message;
    await supabaseAdmin
      .from("scheduled_posts")
      .update({ status: "erro", error_message: message })
      .eq("id", postId);
    throw e;
  }
}

/** Publishes every post whose scheduled time has arrived. */
export async function publishDuePosts() {
  const { data, error } = await supabaseAdmin
    .from("scheduled_posts")
    .select("id")
    .eq("status", "agendado")
    .lte("scheduled_at", new Date().toISOString())
    .limit(20);
  if (error) throw error;

  const results: { id: string; ok: boolean; error?: string }[] = [];
  for (const row of data ?? []) {
    try {
      await publishScheduledPostById(row.id);
      results.push({ id: row.id, ok: true });
    } catch (e) {
      results.push({ id: row.id, ok: false, error: (e as Error).message });
    }
  }
  return results;
}
