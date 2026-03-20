import { NextResponse } from 'next/server';

import {
  clearAdminSession,
  hasAdminSession,
  isAdminConfigured,
  isValidAdminPassword,
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
        error: 'Admin access is disabled until ADMIN_DASHBOARD_KEY is configured.'
      },
      { status: 503 }
    );
  }

  const { password = '' } = await request.json();

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Invalid admin key.'
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
