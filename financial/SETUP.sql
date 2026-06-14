-- ============================================================
-- BRE Invoice — Supabase setup
-- Run this once in Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Table
create table if not exists public.invoices (
  id              uuid primary key default gen_random_uuid(),
  invoice_no      text,
  issue_date      date,
  due_date        date,
  currency        text,
  account         text,
  client_name     text,
  client_addr     text,
  client_country  text,
  items           jsonb,
  subtotal        numeric,
  vat_rate        numeric,
  vat_amount      numeric,
  total           numeric,
  notes           text,
  status          text default 'unpaid',
  paid_at         date,
  created_by      text,
  created_at      timestamptz default now()
);

-- If the table already existed, make sure the newer columns are present:
alter table public.invoices add column if not exists vat_rate   numeric;
alter table public.invoices add column if not exists vat_amount numeric;
alter table public.invoices add column if not exists status     text default 'unpaid';
alter table public.invoices add column if not exists paid_at    date;

-- 2) Lock it down
alter table public.invoices enable row level security;

-- Only logged-in users (you) can read / change history.
drop policy if exists "admin read"   on public.invoices;
drop policy if exists "admin update" on public.invoices;
drop policy if exists "admin delete" on public.invoices;
create policy "admin read"   on public.invoices for select to authenticated using (true);
create policy "admin update" on public.invoices for update to authenticated using (true);
create policy "admin delete" on public.invoices for delete to authenticated using (true);
-- (No insert policy: inserts happen only through create_invoice() below,
--  so guests can add invoices but can never read your history.)

-- 3) Next invoice number for a given issue date (preview). Returns only a string.
create or replace function public.next_invoice_no(d date)
returns text
language sql
security definer
set search_path = public
as $$
  select 'INV-' || to_char($1, 'YYYY-MM-DD') || '-' ||
         lpad((count(*) + 1)::text, 3, '0')
  from public.invoices
  where issue_date = $1;
$$;

-- 4) Atomic create: computes the number and inserts. Used by admin AND guests.
create or replace function public.create_invoice(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  d  date := (payload->>'issue_date')::date;
  no text;
begin
  no := 'INV-' || to_char(d, 'YYYY-MM-DD') || '-' ||
        lpad((select count(*) + 1 from public.invoices where issue_date = d)::text, 3, '0');

  insert into public.invoices
    (invoice_no, issue_date, due_date, currency, account,
     client_name, client_addr, client_country, items, subtotal,
     vat_rate, vat_amount, total, notes, created_by)
  values
    (no, d, nullif(payload->>'due_date','')::date, payload->>'currency', payload->>'account',
     payload->>'client_name', payload->>'client_addr', payload->>'client_country',
     payload->'items', (payload->>'subtotal')::numeric,
     nullif(payload->>'vat_rate','')::numeric, nullif(payload->>'vat_amount','')::numeric,
     (payload->>'total')::numeric,
     payload->>'notes', coalesce(payload->>'created_by','guest'));

  return no;
end;
$$;

-- 5) Let the website (anon) and you (authenticated) call the two functions.
grant execute on function public.next_invoice_no(date) to anon, authenticated;
grant execute on function public.create_invoice(jsonb) to anon, authenticated;

-- 6) Expenses / transactions ledger (admin-only; guests never touch this).
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  ts_date     date not null,
  direction   text not null default 'out',   -- 'out' = expense, 'in' = income
  amount      numeric not null,
  currency    text default 'GEL',
  category    text,
  project     text,
  note        text,
  source      text default 'manual',         -- 'manual' or 'import-...'
  ext_id      text,                           -- bank txn id / hash, for import dedupe
  created_at  timestamptz default now()
);
alter table public.transactions enable row level security;
drop policy if exists "tx admin all" on public.transactions;
create policy "tx admin all" on public.transactions for all to authenticated using (true) with check (true);
create unique index if not exists transactions_ext_id_uniq on public.transactions(ext_id) where ext_id is not null;
