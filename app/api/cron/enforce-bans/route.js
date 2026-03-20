import { NextResponse } from 'next/server';

import { sweepMissedPickups } from '@/lib/server-store';

export const dynamic = 'force-dynamic';

function isAuthorizedCronRequest(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get('authorization') || '';
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized'
      },
      { status: 401 }
    );
  }

  try {
    const result = await sweepMissedPickups();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Cron ban enforcement error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to enforce missed pickup bans.',
        code: error.code || 'CRON_BAN_ENFORCEMENT_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
