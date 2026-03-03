create table reels (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references sessions(id) on delete cascade not null,
  context_id   uuid references reel_contexts(id) on delete set null,
  template     text check (template in ('educational','marketing','entertainment','storytelling','product-demo')) not null,
  title        text,
  status       text check (status in ('pending','generating-blueprint','generating-assets','ready','failed')) default 'pending' not null,
  total_scenes integer,
  duration_sec numeric(6,2),
  metadata     jsonb default '{}',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger reels_updated_at
  before update on reels
  for each row execute function update_updated_at();
