create table generation_jobs (
  id            uuid primary key default gen_random_uuid(),
  reel_id       uuid references reels(id) on delete cascade not null unique,
  status        text check (status in ('queued','running','done','failed')) default 'queued' not null,
  total_steps   integer not null default 0,
  done_steps    integer not null default 0,
  error_message text,
  started_at    timestamptz,
  finished_at   timestamptz,
  created_at    timestamptz default now()
);
