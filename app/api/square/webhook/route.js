import { NextResponse } from 'next/server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import { verifySquareWebhookSignature } from '@/lib/square-server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const requestBody = await request.text();
    const signatureHeader = request.headers.get('x-square-hmacsha256-signature');
    const notificationUrl = request.url;

    if (process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
      const valid = verifySquareWebhookSignature({
        requestBody,
        signatureHeader,
        notificationUrl
      });

      if (!valid) {
        return NextResponse.json(
          {
            error: 'Invalid Square webhook signature.'
          },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(requestBody);
    const payment = event?.data?.object?.payment;
    const client = getSupabaseAdmin();

    if (client && payment?.id) {
      const status = payment.status || null;
      await client
        .from('store_orders')
        .update({
          payment_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('square_payment_id', payment.id);
    }

    return NextResponse.json(
      {
        received: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Square webhook error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to process the Square webhook.'
      },
      { status: 500 }
    );
  }
}
