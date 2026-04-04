import { NextResponse } from 'next/server';

import { createOrderRecord, getClientIp } from '@/lib/server-store';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';

export async function POST(request) {
  // Rate limit: 10 order submissions per minute per IP
  const rlKey = getRateLimitKey(request, 'orders');
  const rl = checkRateLimit(rlKey, { windowMs: 60_000, maxRequests: 10 });

  if (rl.limited) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many order requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED'
      },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) }
      }
    );
  }

  try {
    const order = await request.json();
    const result = await createOrderRecord({
      order,
      ipAddress: getClientIp(request)
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unable to submit the order.',
        code: error.code || 'ORDER_CREATE_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
