-- ============================================================================
-- Youth Policy Lab — Supabase schema
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
--
-- Security model: the website talks to Supabase ONLY from the server, using
-- the service-role key. Row-level security is enabled on every table with NO
-- policies for the anon/authenticated roles, so the public API key cannot
-- read or write anything — in particular, applications are never exposed.
-- ============================================================================

create extension if not exists pgcrypto;

-- Publications (research library + Mini Gurgaon Policy Briefs) -------------
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  abstract text not null default '',
  executive_summary text,
  key_findings text[] not null default '{}',
  recommendations text[] not null default '{}',
  "references" text[] not null default '{}',
  type text not null default 'policy-paper'
    check (type in ('policy-paper','research-paper','policy-brief','gurgaon-brief','report','working-paper','other')),
  category text not null default '',
  tags text[] not null default '{}',
  authors text[] not null default '{}',
  published_at date not null default current_date,
  cover_image_url text,
  pdf_url text,
  page_count int,
  issue_number int,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists publications_status_idx on public.publications (status, published_at desc);

-- Team & advisors ------------------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  section text not null default 'research'
    check (section in ('leadership','board','research','department-heads','advisors')),
  department text,
  bio text,
  expertise text[] not null default '{}',
  photo_url text,
  linkedin_url text,
  sort_order int not null default 100,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Initiatives & events -------------------------------------------------------
create table if not exists public.initiatives (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  kind text not null default 'event'
    check (kind in ('research-initiative','conference','symposium','roundtable','survey','workshop','partnership','special-project','event')),
  summary text not null default '',
  description text,
  start_date date,
  end_date date,
  location text,
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed')),
  related_publications text[] not null default '{}',
  image_url text,
  registration_url text,
  outcomes text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Applications (team / board / advisor) — PRIVATE ----------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  pathway text not null check (pathway in ('team','board','advisor')),
  name text not null,
  email text not null,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'new'
    check (status in ('new','reviewing','shortlisted','accepted','declined','archived')),
  reviewer_notes text
);
create index if not exists applications_created_idx on public.applications (created_at desc);

-- Contact messages — PRIVATE -------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  inquiry_type text not null,
  organisation text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','replied','archived'))
);

-- Lock everything down: RLS on, no public policies. -------------------------
alter table public.publications      enable row level security;
alter table public.team_members      enable row level security;
alter table public.initiatives       enable row level security;
alter table public.applications      enable row level security;
alter table public.contact_messages  enable row level security;

-- Storage bucket for PDFs and images. Public READ (so anyone can download
-- research); uploads only via signed URLs created by the server.
insert into storage.buckets (id, name, public)
values ('publications', 'publications', true)
on conflict (id) do update set public = true;
