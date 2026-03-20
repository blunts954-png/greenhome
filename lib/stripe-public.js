export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}

export function isStripePublicConfigured() {
  return Boolean(getStripePublishableKey());
}
