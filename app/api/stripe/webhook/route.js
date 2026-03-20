import { NextResponse } from 'next/server';

import { getSupabaseAdmin } from '@/lib/supabase/server';
import { constructStripeWebhookEvent } from '@/lib/stripe-server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const requestBody = await request.text();
    const signatureHeader = request.headers.get('stripe-signature');
    const event = process.env.STRIPE_WEBHOOK_SECRET
      ? constructStripeWebhookEvent({
          requestBody,
          signatureHeader
        })
      : JSON.parse(requestBody);
    const client = getSupabaseAdmin();

    if (!event) {
      return NextResponse.json(
        {
          error: 'Invalid Stripe webhook signature.'
        },
        { status: 401 }
      );
    }

    if (client) {
      const timestamp = new Date().toISOString();

      if (
        event.type === 'payment_intent.succeeded' ||
        event.type === 'payment_intent.processing' ||
        event.type === 'payment_intent.payment_failed'
      ) {
        const paymentIntent = event.data.object;
        const chargeId =
          typeof paymentIntent.latest_charge === 'string'
            ? paymentIntent.latest_charge
            : paymentIntent.latest_charge?.id || null;

        await client
          .from('store_orders')
          .update({
            payment_status: paymentIntent.status,
            stripe_charge_id: chargeId,
            status: event.type === 'payment_intent.payment_failed' ? 'Cancelled' : undefined,
            updated_at: timestamp
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);
      }

      if (event.type === 'charge.succeeded' || event.type === 'charge.failed') {
        const charge = event.data.object;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id || null;

        if (paymentIntentId) {
          await client
            .from('store_orders')
            .update({
              payment_status: event.type === 'charge.succeeded' ? 'succeeded' : 'failed',
              stripe_charge_id: charge.id,
              status: event.type === 'charge.failed' ? 'Cancelled' : undefined,
              updated_at: timestamp
            })
            .eq('stripe_payment_intent_id', paymentIntentId);
        }
      }
    }

    return NextResponse.json(
      {
        received: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to process the Stripe webhook.'
      },
      { status: 500 }
    );
  }
}
