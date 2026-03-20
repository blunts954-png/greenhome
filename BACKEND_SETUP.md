# Backend Setup

## 1. Create the Supabase project

Create a new Supabase project, then open `SQL Editor`.

Paste this exact SQL and run it:

```sql
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
```

The same SQL also lives in [supabase/migrations/20260319_store_backend.sql](c:/Users/blunt/Desktop/home%20grown/supabase/migrations/20260319_store_backend.sql).

## 2. Add Vercel environment variables

Add these first:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_DASHBOARD_KEY=change_this_admin_key
CRON_SECRET=change_this_cron_secret
```

Then add mail delivery:

```env
MAIL_TO=moneygrowontrees80@gmail.com
CONTACT_TO_EMAIL=moneygrowontrees80@gmail.com
ORDER_ALERT_TO_EMAIL=moneygrowontrees80@gmail.com
GMAIL_USER=moneygrowontrees80@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

Optional:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+16610000000
ALERT_PHONE_1=+16610000000
ALERT_PHONE_2=
ALERT_PHONE_3=
ALERT_PHONE_4=
ALERT_PHONE_5=
ALERT_PHONE_6=
```

## 3. Redeploy on Vercel

After the env vars are added, redeploy the project.

## 4. What should work after deploy

- Orders save to Supabase
- Account bans persist
- Stored IP bans persist
- Admin dashboard reads real order/account data
- Missed pickup enforcement runs from Vercel cron every 15 minutes

Cron config is in [vercel.json](c:/Users/blunt/Desktop/home%20grown/vercel.json).
