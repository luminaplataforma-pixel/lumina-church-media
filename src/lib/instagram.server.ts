// Server-only helpers for the official Meta / Instagram Graph API.
// The Meta App Secret and the account access tokens never leave this module.
const GRAPH = "https://graph.instagram.com/v23.0";

export function metaCredentials() {
  const clientId = process.env['META_APP_ID'];
  const clientSecret = process.env['META_APP_SECRET'];
  if (!clientId || !clientSecret) {
    throw new Error(
      "A conexão com o Instagram ainda não foi configurada pela igreja (credenciais da Meta ausentes).",
    );
  }
  return { clientId, clientSecret };
}

export async function graph<T>(
  path: string,
  accessToken: string,
  init?: { method?: string; params?: Record<string, string> },
): Promise<T> {
  const url = new URL(`${GRAPH}${path}`);
  const method = init?.method ?? "GET";
  const params = new URLSearchParams({ ...(init?.params ?? {}), access_token: accessToken });

  const res =
    method === "GET"
      ? await fetch(`${url.toString()}?${params.toString()}`)
      : await fetch(url.toString(), {
          method,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });

  const body = await res.text();
  if (!res.ok) {
    console.error(`[instagram] ${method} ${path} falhou [${res.status}]: ${body}`);
    let message = body;
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } };
      message = parsed.error?.message ?? body;
    } catch {
      /* keep raw body */
    }
    throw new Error(`Instagram: ${message}`);
  }
  return JSON.parse(body) as T;
}

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const { clientId, clientSecret } = metaCredentials();
  const res = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    }).toString(),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[instagram] troca de código falhou [${res.status}]: ${text}`);
    throw new Error("Não foi possível concluir a autorização com a Meta.");
  }
  return JSON.parse(text) as { access_token: string; user_id: string | number };
}

export async function toLongLivedToken(shortLived: string) {
  const { clientSecret } = metaCredentials();
  const url = new URL("https://graph.instagram.com/access_token");
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("access_token", shortLived);
  const res = await fetch(url.toString());
  const text = await res.text();
  if (!res.ok) {
    console.error(`[instagram] token longo falhou [${res.status}]: ${text}`);
    throw new Error("Não foi possível validar a autorização da Meta.");
  }
  return JSON.parse(text) as { access_token: string; expires_in: number };
}

export async function refreshLongLivedToken(token: string) {
  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", token);
  const res = await fetch(url.toString());
  const text = await res.text();
  if (!res.ok) {
    console.error(`[instagram] refresh falhou [${res.status}]: ${text}`);
    throw new Error("A autorização do Instagram expirou. Conecte a conta novamente.");
  }
  return JSON.parse(text) as { access_token: string; expires_in: number };
}

export type IgProfile = {
  user_id?: string;
  id?: string;
  username: string;
  account_type?: string;
  media_count?: number;
  followers_count?: number;
};

export function fetchProfile(token: string) {
  return graph<IgProfile>("/me", token, {
    params: { fields: "user_id,username,account_type,media_count,followers_count" },
  });
}

export type IgMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

export function fetchMedia(token: string, limit = 25) {
  return graph<{ data: IgMedia[] }>("/me/media", token, {
    params: {
      fields:
        "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
      limit: String(limit),
    },
  });
}

export function fetchInsights(token: string) {
  return graph<{ data: { name: string; total_value?: { value?: number } }[] }>("/me/insights", token, {
    params: {
      metric: "reach,profile_views,accounts_engaged,total_interactions,likes,comments,shares,saves,views",
      period: "day",
      metric_type: "total_value",
    },
  });
}

export async function createMediaContainer(
  igUserId: string,
  token: string,
  input: { mediaUrl: string; caption: string; mediaType: string },
) {
  const isVideo = input.mediaType === "REELS" || input.mediaType === "VIDEO";
  const params: Record<string, string> = { caption: input.caption };
  if (isVideo) {
    params['media_type'] = "REELS";
    params['video_url'] = input.mediaUrl;
  } else {
    params['image_url'] = input.mediaUrl;
  }
  const out = await graph<{ id: string }>(`/${igUserId}/media`, token, { method: "POST", params });
  return out.id;
}

export function containerStatus(creationId: string, token: string) {
  return graph<{ status_code: string; status?: string }>(`/${creationId}`, token, {
    params: { fields: "status_code,status" },
  });
}

export async function publishContainer(igUserId: string, token: string, creationId: string) {
  const out = await graph<{ id: string }>(`/${igUserId}/media_publish`, token, {
    method: "POST",
    params: { creation_id: creationId },
  });
  const detail = await graph<{ permalink?: string }>(`/${out.id}`, token, {
    params: { fields: "permalink" },
  }).catch(() => ({ permalink: undefined }));
  return { mediaId: out.id, permalink: detail.permalink ?? null };
}

export async function waitForContainer(creationId: string, token: string, tries = 8) {
  for (let i = 0; i < tries; i++) {
    const s = await containerStatus(creationId, token);
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") {
      throw new Error("O Instagram não conseguiu processar a mídia enviada.");
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("A mídia ainda está sendo processada pelo Instagram. Tente publicar novamente.");
}
