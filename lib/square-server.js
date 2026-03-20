import 'server-only';

import { SquareClient, SquareEnvironment, WebhooksHelper } from 'square';

import { getSquareApplicationId, getSquareEnvironmentName, getSquareLocationId, isSquarePublicConfigured } from '@/lib/square-public';

let cachedClient = null;

function getSquareAccessToken() {
  return process.env.SQUARE_ACCESS_TOKEN || '';
}

export function isSquareServerConfigured() {
  return Boolean(getSquareAccessToken() && isSquarePublicConfigured());
}

function getSquareEnvironment() {
  return getSquareEnvironmentName() === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;
}

export function getSquareClient() {
  if (!isSquareServerConfigured()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new SquareClient({
      token: getSquareAccessToken(),
      environment: getSquareEnvironment()
    });
  }

  return cachedClient;
}

export function getSquareServerConfig() {
  return {
    configured: isSquareServerConfigured(),
    applicationId: getSquareApplicationId(),
    locationId: getSquareLocationId(),
    environmentName: getSquareEnvironmentName()
  };
}

export async function createSquarePayment({
  sourceId,
  amount,
  idempotencyKey,
  referenceId,
  note,
  buyerEmailAddress,
  buyerPhoneNumber
}) {
  const client = getSquareClient();

  if (!client) {
    throw new Error('Square is not configured.');
  }

  const response = await client.payments.create({
    sourceId,
    idempotencyKey,
    locationId: getSquareLocationId(),
    amountMoney: {
      amount: BigInt(amount),
      currency: 'USD'
    },
    autocomplete: true,
    referenceId,
    note,
    buyerEmailAddress,
    buyerPhoneNumber
  });

  return response.payment;
}

export function verifySquareWebhookSignature({
  requestBody,
  signatureHeader,
  notificationUrl
}) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '';

  if (!signatureKey || !signatureHeader) {
    return false;
  }

  return WebhooksHelper.verifySignature({
    requestBody,
    signatureHeader,
    signatureKey,
    notificationUrl
  });
}
