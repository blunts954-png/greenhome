import { NextResponse } from 'next/server';

import { hasAdminSession } from '@/lib/admin-auth';
import { getDashboardSnapshot } from '@/lib/server-store';

export async function GET(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized'
      },
      { status: 401 }
    );
  }

  try {
    const snapshot = await getDashboardSnapshot();
    return NextResponse.json(snapshot, { status: 200 });
  } catch (error) {
    console.error('Admin dashboard error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to load admin dashboard.',
        code: error.code || 'ADMIN_DASHBOARD_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
