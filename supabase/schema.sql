-- JARVIS X5 GARAGE OS — cross-device sync schema.
-- Run this once in the Supabase SQL editor for your project.
--
-- The app talks to this table only through its own server-side API routes
-- using the service role key, which bypasses RLS. RLS is enabled with no
-- policies below purely as a safety net in case the anon/public key is ever
-- used against this table directly — it denies that access entirely.

create table if not exists app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table app_state enable row level security;
-- No policies are created: only the service role (used server-side) can
-- read or write this table. anon/authenticated roles get nothing.
