# Backend Setup

## 1. Create the Supabase project

Create a new Supabase project, then open `SQL Editor`.

Run the base schema first:

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

Then run the Stripe payment field migration:

```sql
alter table if exists public.store_orders
  add column if not exists payment_provider text default 'manual',
  add column if not exists payment_status text,
  add column if not exists payment_reference_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_payment_method_id text,
  add column if not exists stripe_charge_id text,
  add column if not exists demo_order boolean not null default false;

create index if not exists store_orders_stripe_payment_intent_id_idx
  on public.store_orders (stripe_payment_intent_id);

create index if not exists store_orders_stripe_charge_id_idx
  on public.store_orders (stripe_charge_id);
```

That second SQL also lives in [supabase/migrations/20260319_stripe_payment_fields.sql](c:/Users/blunt/Desktop/home%20grown/supabase/migrations/20260319_stripe_payment_fields.sql).

## 2. Add Vercel environment variables

Add these first:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_DASHBOARD_KEY=HSM2026
```

The admin login accepts `HSM2026` by default. Setting `ADMIN_DASHBOARD_KEY` adds your own override key if you want a second login passcode available.

Add the Stripe values next:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

Use Stripe test keys first, then replace them with live keys only when you are ready to process real card payments.

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

If you still want the non-live card flow while setup is incomplete, you can turn the demo checkout back on:

```env
NEXT_PUBLIC_CHECKOUT_DEMO_MODE=true
CHECKOUT_DEMO_MODE=true
```

## 3. Redeploy on Vercel

After the env vars are added, redeploy the project.

## 4. What should work after deploy

- Orders save to Supabase
- Account bans persist
- Stored IP bans persist
- Admin dashboard reads real order/account data
- Apparel shipping + `Card` opens Stripe card entry and charges through the backend
- Apparel pickup orders can be submitted without online card entry
- Local cannabis reservations stay 21+ and Bakersfield pickup only

Stripe routes:
- `/api/stripe/payment-intent`
- `/api/stripe/webhook`

Important note:
- If you already ran the older Square migration from a previous repo version, you can leave those unused columns in place. The current app now reads and writes the Stripe-specific columns above.
