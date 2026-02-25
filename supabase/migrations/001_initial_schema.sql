-- Journal entries table
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_key text not null,
  text text not null default '',
  title text not null default '',
  date timestamptz not null default now(),
  tag text check (tag in ('consolation', 'desolation')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, entry_key)
);

-- User preferences table
create table if not exists user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  reminder_time text,
  week_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table journal_entries enable row level security;
alter table user_preferences enable row level security;

-- Users can only access their own journal entries
create policy "Users can read own entries" on journal_entries
  for select using (auth.uid() = user_id);

create policy "Users can insert own entries" on journal_entries
  for insert with check (auth.uid() = user_id);

create policy "Users can update own entries" on journal_entries
  for update using (auth.uid() = user_id);

create policy "Users can delete own entries" on journal_entries
  for delete using (auth.uid() = user_id);

-- Users can only access their own preferences
create policy "Users can read own preferences" on user_preferences
  for select using (auth.uid() = user_id);

create policy "Users can insert own preferences" on user_preferences
  for insert with check (auth.uid() = user_id);

create policy "Users can update own preferences" on user_preferences
  for update using (auth.uid() = user_id);

-- Updated-at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger journal_entries_updated_at
  before update on journal_entries
  for each row execute function update_updated_at();

create trigger user_preferences_updated_at
  before update on user_preferences
  for each row execute function update_updated_at();
