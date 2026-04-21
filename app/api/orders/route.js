import { NextResponse } from 'next/server';

import { createOrderRecord, getClientIp } from '@/lib/server-store';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';

export async function POST(request) {
  // Rate Limit: 5 order attempts per minute
  const limit = checkRateLimit(getRateLimitKey(request, 'orders'), { maxRequests: 5 });
  if (limit.limited) {
    return NextResponse.json(
      { success: false, error: 'Too many order attempts. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
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
