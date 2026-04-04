import { NextResponse } from 'next/server';

import { hasAdminSession } from '@/lib/admin-auth';
import { setAccountBanState } from '@/lib/server-store';

export async function PATCH(request, context) {
  if (!hasAdminSession(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized.'
      },
      { status: 401 }
    );
  }

  try {
    const { accountId } = await context.params;
    const { banned = false, reason = '' } = await request.json();
    const account = await setAccountBanState(accountId, {
      banned: Boolean(banned),
      reason
    });

    return NextResponse.json({
      success: true,
      account
    });
  } catch (error) {
    console.error('Admin account update error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to update the account.',
        code: error.code || 'ADMIN_ACCOUNT_UPDATE_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
