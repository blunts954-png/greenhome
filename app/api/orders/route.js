import { NextResponse } from 'next/server';

import { createOrderRecord, getClientIp } from '@/lib/server-store';

export async function POST(request) {
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
