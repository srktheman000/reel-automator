create table reel_scenes (
  id           uuid primary key default gen_random_uuid(),
  reel_id      uuid references reels(id) on delete cascade not null,
  sort_order   integer not null,
  type         text check (type in ('hook','context','value','cta')) not null,
  script_text  text not null,
  caption_text text,
  image_prompt text,
  start_sec    numeric(6,2) not null,
  end_sec      numeric(6,2) not null,
  image_url    text,
  audio_url    text,
  image_status text check (image_status in ('pending','generating','ready','failed')) default 'pending',
  audio_status text check (audio_status in ('pending','generating','ready','failed')) default 'pending',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create trigger reel_scenes_updated_at
  before update on reel_scenes
  for each row execute function update_updated_at();
