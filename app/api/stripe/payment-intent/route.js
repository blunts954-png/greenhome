import { NextResponse } from 'next/server';

import {
  checkBanStatus,
  getClientIp,
  getOrderAmountInCents,
  prepareOrderInput,
  requiresStripeCheckout
} from '@/lib/server-store';
import { createStripePaymentIntent, isStripeServerConfigured } from '@/lib/stripe-server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    if (!isStripeServerConfigured()) {
      return NextResponse.json(
        {
          error: 'Stripe is not configured yet. Add the Stripe publishable key and secret key first.'
        },
        { status: 503 }
      );
    }

    const order = await request.json();
    const preparedOrder = prepareOrderInput(order);

    if (!requiresStripeCheckout(preparedOrder)) {
      return NextResponse.json(
        {
          error: 'Stripe payment intents are only used for shipping card orders.'
        },
        { status: 400 }
      );
    }

    const banStatus = await checkBanStatus({
      email: preparedOrder.email,
      phone: preparedOrder.normalizedPhone,
      ipAddress: getClientIp(request)
    });

    if (banStatus.blocked) {
      return NextResponse.json(
        {
          error: banStatus.banReason || 'This account is currently blocked.',
          code: 'ACCOUNT_BANNED'
        },
        { status: 403 }
      );
    }

    const paymentIntent = await createStripePaymentIntent({
      amount: getOrderAmountInCents(preparedOrder.total),
      description: `Home Grown shipping order for ${preparedOrder.fullName}`,
      receiptEmail: preparedOrder.email,
      metadata: {
        customer_email: preparedOrder.email,
        normalized_phone: preparedOrder.normalizedPhone,
        order_type: preparedOrder.type,
        payment_method: preparedOrder.payment,
        item_count: String(preparedOrder.items.length)
      }
    });

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe payment intent error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Unable to start Stripe checkout.',
        code: error.code || 'STRIPE_PAYMENT_INTENT_FAILED'
      },
      { status: error.status || 500 }
    );
  }
}
