-- Create the notes table
create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  link text,
  cover_image text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table notes enable row level security;

-- Create a policy that allows all operations for now
-- Note: In a production app with authentication, you would restrict this to authenticated users
-- e.g., using "auth.uid() = user_id" if you had a user_id column.
create policy "Allow public access for notes" 
on notes for all 
using (true) 
with check (true);

-- Optional: Create a function to automatically update updated_at
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on notes
  for each row execute procedure moddatetime (updated_at);
