import { NextResponse } from 'next/server';

import { checkBanStatus, getClientIp } from '@/lib/server-store';

export async function POST(request) {
  try {
    const { email, phone } = await request.json();
    const result = await checkBanStatus({
      email,
      phone,
      ipAddress: getClientIp(request)
    });

    if (!result.backendReady) {
      return NextResponse.json(
        {
          blocked: false,
          error: 'Checkout backend is not configured yet.',
          code: 'BACKEND_NOT_CONFIGURED'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Account check error:', error);

    return NextResponse.json(
      {
        blocked: false,
        error: error.message || 'Unable to verify account status.',
        code: error.code || 'ACCOUNT_CHECK_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
