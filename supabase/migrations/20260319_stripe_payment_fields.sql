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
