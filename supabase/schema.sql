-- ============================================================
-- Smart Review - Supabase Database Schema
-- ============================================================
-- Run this SQL in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Profiles (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  title text default '',
  content text default '',
  is_public boolean default false,
  share_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table documents enable row level security;

-- Owner can do anything
create policy "Owners have full access"
  on documents for all
  using (auth.uid() = owner_id);

-- Public documents can be viewed by anyone
create policy "Public documents are viewable"
  on documents for select
  using (is_public = true);

-- Users with permissions can view
create policy "Shared users can view"
  on documents for select
  using (
    exists (
      select 1 from document_permissions
      where document_permissions.document_id = documents.id
      and document_permissions.user_id = auth.uid()
    )
  );

-- Users with edit permission can update
create policy "Shared users with edit can update"
  on documents for update
  using (
    exists (
      select 1 from document_permissions
      where document_permissions.document_id = documents.id
      and document_permissions.user_id = auth.uid()
      and document_permissions.permission in ('edit', 'admin')
    )
  );

-- 3. Document Permissions
create table if not exists document_permissions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  permission text check (permission in ('view', 'edit', 'admin')),
  created_at timestamptz default now(),
  unique(document_id, user_id)
);

alter table document_permissions enable row level security;

create policy "Document owners can manage permissions"
  on document_permissions for all
  using (
    exists (
      select 1 from documents
      where documents.id = document_permissions.document_id
      and documents.owner_id = auth.uid()
    )
  );

create policy "Users can view own permissions"
  on document_permissions for select
  using (user_id = auth.uid());

-- 4. Data Sources
create table if not exists data_sources (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  name text not null,
  type text check (type in ('csv', 'excel', 'json', 'api')),
  data jsonb default '[]',
  columns text[] default '{}',
  created_at timestamptz default now()
);

alter table data_sources enable row level security;

create policy "Document owners can manage data sources"
  on data_sources for all
  using (
    exists (
      select 1 from documents
      where documents.id = data_sources.document_id
      and documents.owner_id = auth.uid()
    )
  );

create policy "Shared users can view data sources"
  on data_sources for select
  using (
    exists (
      select 1 from document_permissions
      where document_permissions.document_id = data_sources.document_id
      and document_permissions.user_id = auth.uid()
    )
  );

-- 5. Indexes for performance
create index if not exists idx_documents_owner on documents(owner_id);
create index if not exists idx_documents_share_id on documents(share_id);
create index if not exists idx_document_permissions_document on document_permissions(document_id);
create index if not exists idx_document_permissions_user on document_permissions(user_id);
create index if not exists idx_data_sources_document on data_sources(document_id);

-- 6. Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger documents_updated_at
  before update on documents
  for each row execute procedure update_updated_at();
