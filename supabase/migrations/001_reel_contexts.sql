create table reel_contexts (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references sessions(id) on delete cascade not null,
  source_type  text check (source_type in ('text', 'pdf')) not null,
  raw_text     text not null,
  storage_path text,
  created_at   timestamptz default now()
);
