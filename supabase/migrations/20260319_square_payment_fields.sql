alter table if exists public.store_orders
  add column if not exists payment_provider text default 'manual',
  add column if not exists payment_status text,
  add column if not exists payment_reference_id text,
  add column if not exists square_payment_id text,
  add column if not exists square_order_id text,
  add column if not exists demo_order boolean not null default false;

create index if not exists store_orders_square_payment_id_idx
  on public.store_orders (square_payment_id);
