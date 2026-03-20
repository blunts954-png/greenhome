import { NextResponse } from 'next/server';

import { clearAdminSession, hasAdminSession, isValidAdminPassword, setAdminSession } from '@/lib/admin-auth';

export async function GET(request) {
  return NextResponse.json({
    authenticated: hasAdminSession(request)
  });
}

export async function POST(request) {
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
