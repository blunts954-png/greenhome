import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { normalizePhone } from '@/lib/server-store';

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

export async function POST(request) {
  const { orderNumber, email } = await request.json();

  if (!orderNumber?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Order number and email are required.' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Order lookup is not available yet.' }, { status: 503 });
  }

  const client = getSupabaseAdmin();
  const normalizedEmail = normalizeEmail(email);

  const { data, error } = await client
    .from('store_orders')
    .select('order_number, status, order_type, payment_method, total, created_at, items, customer_first_name, customer_last_name, customer_email, customer_phone, pickup_deadline')
    .eq('order_number', orderNumber.trim().toUpperCase())
    .eq('customer_email', normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error('Order lookup error:', error);
    return NextResponse.json({ error: 'Lookup failed. Please try again.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'No order found matching that order number and email.' }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      orderNumber: data.order_number,
      status: data.status,
      type: data.order_type,
      payment: data.payment_method,
      total: Number(data.total),
      date: data.created_at,
      pickupDeadline: data.pickup_deadline,
      customerName: `${data.customer_first_name} ${data.customer_last_name}`.trim(),
      items: Array.isArray(data.items) ? data.items : [],
    },
  });
}
