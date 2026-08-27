
create type public.app_role as enum ('admin','editor','viewer','media','pastoral');
create type public.content_type as enum ('feed','carrossel','reels','stories','culto','evento','devocional','testemunho','aviso','versiculo');
create type public.content_status as enum ('ideia','planejamento','producao','revisao','agendado','publicado','cancelado');
create type public.event_status as enum ('planejado','confirmado','realizado','cancelado');
create type public.media_role as enum ('storymaker','videomaker','fotografia','multimidia','live');

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, workspace_id, role)
);

create or replace function public.current_workspace_id()
returns uuid language sql stable security definer set search_path = public as $$
  select workspace_id from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  photo_url text,
  roles public.media_role[] not null default '{}',
  phone text,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  event_date date not null,
  event_time time,
  description text,
  location text,
  leader text,
  image_url text,
  status public.event_status not null default 'planejado',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verses (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  book text not null,
  chapter int not null,
  verse text not null,
  text text not null,
  theme text,
  category text,
  favorite boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.captions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  text text not null,
  category text,
  kind text,
  tags text[] not null default '{}',
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  url text not null,
  storage_path text,
  folder text not null default 'Outros',
  mime_type text,
  size_bytes bigint,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  theme text,
  description text,
  type public.content_type not null default 'feed',
  status public.content_status not null default 'ideia',
  publish_date date,
  owner_id uuid references public.team_members(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  verse_id uuid references public.verses(id) on delete set null,
  caption_id uuid references public.captions(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  image_url text,
  caption_text text,
  notes text,
  checklist jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  schedule_date date not null,
  time_label text not null default 'Culto',
  event_id uuid references public.events(id) on delete set null,
  member_id uuid not null references public.team_members(id) on delete cascade,
  role public.media_role not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  username text not null,
  ig_user_id text,
  status text not null default 'connected',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id)
);

create table public.instagram_insights (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  metric_date date not null,
  followers int not null default 0,
  reach int not null default 0,
  impressions int not null default 0,
  engagement int not null default 0,
  likes int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  saves int not null default 0,
  views int not null default 0,
  profile_visits int not null default 0,
  clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, metric_date)
);

create table public.instagram_media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  caption text not null default '',
  media_type text not null default 'REELS',
  thumbnail_url text,
  reach int not null default 0,
  engagement int not null default 0,
  views int not null default 0,
  posted_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_name text not null default '',
  action text not null,
  entity text not null,
  entity_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on
  public.workspaces, public.profiles, public.user_roles, public.team_members,
  public.events, public.verses, public.captions, public.assets, public.contents,
  public.schedules, public.instagram_accounts, public.instagram_insights,
  public.instagram_media, public.activities
  to authenticated;
grant all on
  public.workspaces, public.profiles, public.user_roles, public.team_members,
  public.events, public.verses, public.captions, public.assets, public.contents,
  public.schedules, public.instagram_accounts, public.instagram_insights,
  public.instagram_media, public.activities
  to service_role;

alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.verses enable row level security;
alter table public.captions enable row level security;
alter table public.assets enable row level security;
alter table public.contents enable row level security;
alter table public.schedules enable row level security;
alter table public.instagram_accounts enable row level security;
alter table public.instagram_insights enable row level security;
alter table public.instagram_media enable row level security;
alter table public.activities enable row level security;

create policy "own workspace read" on public.workspaces for select to authenticated
  using (id = public.current_workspace_id());
create policy "create workspace" on public.workspaces for insert to authenticated
  with check (created_by = auth.uid());
create policy "update own workspace" on public.workspaces for update to authenticated
  using (id = public.current_workspace_id());

create policy "read profiles in workspace" on public.profiles for select to authenticated
  using (id = auth.uid() or workspace_id = public.current_workspace_id());
create policy "insert own profile" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated
  using (id = auth.uid());

create policy "read roles in workspace" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or workspace_id = public.current_workspace_id());
create policy "insert roles in workspace" on public.user_roles for insert to authenticated
  with check (workspace_id = public.current_workspace_id());
create policy "delete roles in workspace" on public.user_roles for delete to authenticated
  using (workspace_id = public.current_workspace_id());

do $$
declare t text;
begin
  foreach t in array array['team_members','events','verses','captions','assets','contents','schedules','instagram_accounts','instagram_insights','instagram_media','activities']
  loop
    execute format('create policy "tenant all" on public.%I for all to authenticated using (workspace_id = public.current_workspace_id()) with check (workspace_id = public.current_workspace_id())', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.update_updated_at_column()', t);
  end loop;
end $$;

create trigger set_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();

create or replace function public.bootstrap_workspace(_church_name text, _full_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare wid uuid; existing uuid;
begin
  select workspace_id into existing from public.profiles where id = auth.uid();
  if existing is not null then return existing; end if;
  insert into public.workspaces (name, created_by) values (coalesce(nullif(_church_name,''),'Minha Igreja'), auth.uid()) returning id into wid;
  insert into public.profiles (id, workspace_id, full_name) values (auth.uid(), wid, coalesce(_full_name,''))
    on conflict (id) do update set workspace_id = wid, full_name = excluded.full_name;
  insert into public.user_roles (user_id, workspace_id, role) values (auth.uid(), wid, 'admin') on conflict do nothing;
  return wid;
end $$;

grant execute on function public.bootstrap_workspace(text, text) to authenticated;

create policy "media read" on storage.objects for select to authenticated using (bucket_id = 'media');
create policy "media insert" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media update" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "media delete" on storage.objects for delete to authenticated using (bucket_id = 'media');
