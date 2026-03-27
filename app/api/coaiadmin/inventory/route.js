import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('inventory_status')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: data || [] });
}

export async function PATCH(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { slug, isOutOfStock } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('inventory_status')
    .upsert({ 
      slug, 
      is_out_of_stock: isOutOfStock,
      updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
