create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  platform text not null default 'instagram',
  instagram_user_id text,
  username text not null default '',
  account_type text,
  token_expires_at timestamptz,
  connected_at timestamptz not null default now(),
  last_sync_at timestamptz,
  status text not null default 'connected',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, platform, instagram_user_id)
);

grant select, insert, update, delete on public.social_accounts to authenticated;
grant all on public.social_accounts to service_role;
alter table public.social_accounts enable row level security;
create policy "tenant all" on public.social_accounts for all to authenticated
  using (workspace_id = public.current_workspace_id())
  with check (workspace_id = public.current_workspace_id());
create trigger set_updated_at before update on public.social_accounts
  for each row execute function public.update_updated_at_column();

create table public.social_account_secrets (
  account_id uuid primary key references public.social_accounts(id) on delete cascade,
  access_token text not null,
  token_type text not null default 'long_lived',
  updated_at timestamptz not null default now()
);
grant all on public.social_account_secrets to service_role;
alter table public.social_account_secrets enable row level security;

create table public.social_oauth_states (
  state text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  redirect_uri text not null,
  created_at timestamptz not null default now()
);
grant all on public.social_oauth_states to service_role;
alter table public.social_oauth_states enable row level security;

create table public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid references public.social_accounts(id) on delete set null,
  content_id uuid references public.contents(id) on delete set null,
  caption text not null default '',
  media_url text not null,
  media_type text not null default 'IMAGE',
  scheduled_at timestamptz not null,
  status text not null default 'agendado',
  ig_creation_id text,
  ig_media_id text,
  permalink text,
  error_message text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.scheduled_posts to authenticated;
grant all on public.scheduled_posts to service_role;
alter table public.scheduled_posts enable row level security;
create policy "tenant all" on public.scheduled_posts for all to authenticated
  using (workspace_id = public.current_workspace_id())
  with check (workspace_id = public.current_workspace_id());
create trigger set_updated_at before update on public.scheduled_posts
  for each row execute function public.update_updated_at_column();

create index scheduled_posts_due_idx on public.scheduled_posts (status, scheduled_at);