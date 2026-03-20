create extension if not exists pgcrypto;

create table if not exists public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text not null,
  normalized_phone text not null,
  first_name text not null,
  last_name text not null,
  full_name text not null,
  birth_date date,
  banned boolean not null default false,
  ban_reason text,
  banned_at timestamptz,
  missed_pickups integer not null default 0,
  last_ip text,
  last_order_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists customer_accounts_email_phone_idx
  on public.customer_accounts (email, normalized_phone);

create index if not exists customer_accounts_banned_idx
  on public.customer_accounts (banned);

create table if not exists public.store_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  account_id uuid references public.customer_accounts(id) on delete restrict,
  customer_first_name text not null,
  customer_last_name text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_birth_date date,
  customer_address text,
  notes text,
  order_type text not null,
  payment_method text not null,
  total numeric(10, 2) not null,
  status text not null default 'Pending',
  pickup_deadline timestamptz,
  missed_pickup_at timestamptz,
  submitted_ip text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists store_orders_status_idx
  on public.store_orders (status);

create index if not exists store_orders_created_at_idx
  on public.store_orders (created_at desc);

create table if not exists public.ban_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.customer_accounts(id) on delete set null,
  ip_address text,
  reason text not null,
  source text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.banned_ips (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null unique,
  account_id uuid references public.customer_accounts(id) on delete set null,
  reason text not null,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists banned_ips_active_idx
  on public.banned_ips (active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists customer_accounts_set_updated_at on public.customer_accounts;
create trigger customer_accounts_set_updated_at
before update on public.customer_accounts
for each row execute procedure public.set_updated_at();

drop trigger if exists store_orders_set_updated_at on public.store_orders;
create trigger store_orders_set_updated_at
before update on public.store_orders
for each row execute procedure public.set_updated_at();

drop trigger if exists banned_ips_set_updated_at on public.banned_ips;
create trigger banned_ips_set_updated_at
before update on public.banned_ips
for each row execute procedure public.set_updated_at();
