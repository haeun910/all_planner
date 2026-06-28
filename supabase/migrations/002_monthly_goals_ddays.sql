-- monthly_goals
create table if not exists public.monthly_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  month       text not null, -- YYYY-MM
  title       text not null,
  completed   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.monthly_goals enable row level security;
create policy "monthly_goals: own data" on public.monthly_goals
  for all using (auth.uid() = user_id);

create index if not exists idx_monthly_goals_user_month on public.monthly_goals(user_id, month);

-- ddays
create table if not exists public.ddays (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  target_date date not null,
  created_at  timestamptz not null default now()
);

alter table public.ddays enable row level security;
create policy "ddays: own data" on public.ddays
  for all using (auth.uid() = user_id);

create index if not exists idx_ddays_user on public.ddays(user_id, target_date);

-- Realtime
alter publication supabase_realtime add table public.monthly_goals;
alter publication supabase_realtime add table public.ddays;
