import 'server-only';

import Stripe from 'stripe';

import { isStripePublicConfigured } from '@/lib/stripe-public';

let cachedClient = null;

function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY || '';
}

export function isStripeServerConfigured() {
  return Boolean(getStripeSecretKey() && isStripePublicConfigured());
}

export function getStripeClient() {
  if (!getStripeSecretKey()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new Stripe(getStripeSecretKey());
  }

  return cachedClient;
}

export async function createStripePaymentIntent({
  amount,
  currency = 'usd',
  description,
  receiptEmail,
  metadata
}) {
  const client = getStripeClient();

  if (!client) {
    throw new Error('Stripe is not configured.');
  }

  return client.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
    description,
    receipt_email: receiptEmail,
    metadata
  });
}

export async function retrieveStripePaymentIntent(paymentIntentId) {
  const client = getStripeClient();

  if (!client) {
    throw new Error('Stripe is not configured.');
  }

  return client.paymentIntents.retrieve(paymentIntentId, {
    expand: ['latest_charge']
  });
}

export function constructStripeWebhookEvent({ requestBody, signatureHeader }) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const client = getStripeClient();

  if (!client || !webhookSecret || !signatureHeader) {
    return null;
  }

  return client.webhooks.constructEvent(requestBody, signatureHeader, webhookSecret);
}
