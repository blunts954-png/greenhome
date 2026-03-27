import { NextResponse } from 'next/server';

import { hasAdminSession } from '@/lib/admin-auth';
import { getDashboardSnapshot } from '@/lib/server-store';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized.'
      },
      { status: 401 }
    );
  }

  try {
    const snapshot = await getDashboardSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Admin dashboard error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to load dashboard data.'
      },
      { status: error.status || 500 }
    );
  }
}
