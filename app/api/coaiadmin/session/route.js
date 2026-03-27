import { NextResponse } from 'next/server';

import {
  clearAdminSession,
  hasAdminSession,
  isAdminConfigured,
  isValidAdminCredentials,
  setAdminSession
} from '@/lib/admin-auth';

export async function GET(request) {
  return NextResponse.json({
    authenticated: hasAdminSession(request),
    configured: isAdminConfigured()
  });
}

export async function POST(request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Admin access is disabled until ADMIN_DASHBOARD_USER and ADMIN_DASHBOARD_KEY are configured.'
      },
      { status: 503 }
    );
  }

  const { username = '', password = '' } = await request.json();

  if (!isValidAdminCredentials(username, password)) {
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Invalid admin credentials.'
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    authenticated: true
  });

  setAdminSession(response);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    authenticated: false
  });

  clearAdminSession(response);

  return response;
}
