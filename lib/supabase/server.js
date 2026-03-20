import 'server-only';

import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();

  return Boolean(url && key && !url.includes('placeholder') && key !== 'placeholder');
}

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(getSupabaseUrl(), getServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return cachedClient;
}
