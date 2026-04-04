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

Then run the inventory management migration:

```sql
CREATE TABLE IF NOT EXISTS inventory_status (
  slug TEXT PRIMARY KEY,
  is_out_of_stock BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE inventory_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin Service Role Full Access" ON inventory_status
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public Read Access" ON inventory_status
  FOR SELECT
  USING (true);
```

That third SQL also lives in [supabase/migrations/20260326_inventory_management.sql](c:/Users/blunt/Desktop/home%20grown/supabase/migrations/20260326_inventory_management.sql).

## 2. Add Vercel environment variables

Add these first:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_DASHBOARD_USER=your_admin_username
ADMIN_DASHBOARD_KEY=your_admin_password
```

The admin area now requires both `ADMIN_DASHBOARD_USER` and `ADMIN_DASHBOARD_KEY`. There is no built-in fallback credential.

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
ENABLE_CUSTOMER_ORDER_EMAIL=true
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

If you still want the non-live card flow while setup is incomplete in staging, you can turn the demo checkout back on:

```env
NEXT_PUBLIC_CHECKOUT_DEMO_MODE=true
CHECKOUT_DEMO_MODE=true
```

## 3. Delete `netlify.toml`

The `netlify.toml` in the repo root was left over from an earlier static-export configuration. It is incompatible with the current Next.js server-side features (API routes, server components, dynamic rendering). Remove it before deploying to Vercel.

## 4. Redeploy on Vercel

After the env vars are added and `netlify.toml` is removed, redeploy the project.

## 5. What should work after deploy

- Orders save to Supabase
- Account bans persist
- Stored IP bans persist
- Admin dashboard reads real order/account data
- Inventory stock toggles from the admin reflect on the public storefront
- Apparel shipping + `Card` opens Stripe card entry and charges through the backend
- Apparel pickup orders can be submitted without online card entry
- Local cannabis reservations stay 21+ and Bakersfield pickup only
- Rate limiting is active on contact, orders, account check, and Stripe payment intent endpoints

Stripe routes:
- `/api/stripe/payment-intent`
- `/api/stripe/webhook`

Important note:
- If you already ran the older Square migration from a previous repo version, you can leave those unused columns in place. The current app now reads and writes the Stripe-specific columns above.
