import { NextResponse } from 'next/server';

import { hasAdminSession } from '@/lib/admin-auth';
import { updateOrderStatusRecord } from '@/lib/server-store';

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
    const { orderNumber } = await context.params;
    const { status = '' } = await request.json();
    const order = await updateOrderStatusRecord(orderNumber, status);

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Admin order update error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to update the order.',
        code: error.code || 'ADMIN_ORDER_UPDATE_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
