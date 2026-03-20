import { NextResponse } from 'next/server';

import { hasAdminSession } from '@/lib/admin-auth';
import { updateOrderStatusRecord } from '@/lib/server-store';

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
    const { status } = await request.json();
    const updatedOrder = await updateOrderStatusRecord(params.orderNumber, status);

    return NextResponse.json(
      {
        order: updatedOrder
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order status update error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to update the order.',
        code: error.code || 'ORDER_STATUS_UPDATE_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
