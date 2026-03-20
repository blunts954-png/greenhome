import { NextResponse } from 'next/server';

import { hasAdminSession } from '@/lib/admin-auth';
import { setAccountBanState } from '@/lib/server-store';

export async function PATCH(request, { params }) {
  if (!hasAdminSession(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized'
      },
      { status: 401 }
    );
  }

  try {
    const { banned, reason } = await request.json();
    const account = await setAccountBanState(params.accountId, { banned, reason });

    return NextResponse.json(
      {
        account
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Account ban update error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to update the account.',
        code: error.code || 'ACCOUNT_UPDATE_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
