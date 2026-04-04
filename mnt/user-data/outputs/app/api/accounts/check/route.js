import { NextResponse } from 'next/server';

import { checkBanStatus, getClientIp } from '@/lib/server-store';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';

export async function POST(request) {
  // Rate limit: 15 account checks per minute per IP
  const rlKey = getRateLimitKey(request, 'acct-check');
  const rl = checkRateLimit(rlKey, { windowMs: 60_000, maxRequests: 15 });

  if (rl.limited) {
    return NextResponse.json(
      {
        blocked: false,
        error: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED'
      },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) }
      }
    );
  }

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
