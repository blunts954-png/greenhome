const DEFAULT_ENVIRONMENT = 'sandbox';

export function getSquareEnvironmentName() {
  return (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || DEFAULT_ENVIRONMENT).toLowerCase() === 'production'
    ? 'production'
    : 'sandbox';
}

export function getSquareApplicationId() {
  return process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
}

export function getSquareLocationId() {
  return process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
}

export function getSquareScriptUrl() {
  return getSquareEnvironmentName() === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';
}

export function isSquarePublicConfigured() {
  return Boolean(getSquareApplicationId() && getSquareLocationId());
}
