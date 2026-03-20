import 'server-only';

import crypto from 'node:crypto';

const ADMIN_COOKIE_NAME = 'hgm_admin_session';
const DEFAULT_ADMIN_KEY = 'HSM2026';

function getPrimaryAdminKey() {
  return process.env.ADMIN_DASHBOARD_KEY?.trim() || DEFAULT_ADMIN_KEY;
}

function getAcceptedAdminKeys() {
  const envKey = process.env.ADMIN_DASHBOARD_KEY?.trim();

  return [DEFAULT_ADMIN_KEY, envKey].filter(Boolean);
}

export function isAdminConfigured() {
  return true;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest();
}

function safeCompare(left = '', right = '') {
  return crypto.timingSafeEqual(sha256(left), sha256(right));
}

export function isValidAdminPassword(password = '') {
  if (!password) {
    return false;
  }

  return getAcceptedAdminKeys().some((adminKey) => safeCompare(password, adminKey));
}

function getSessionToken() {
  const adminKey = getPrimaryAdminKey();

  if (!adminKey) {
    return null;
  }

  return crypto
    .createHash('sha256')
    .update(`${adminKey}::hgm-admin-session`)
    .digest('hex');
}

export function hasAdminSession(request) {
  const value = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const sessionToken = getSessionToken();

  if (!value || !sessionToken) {
    return false;
  }

  return safeCompare(value, sessionToken);
}

export function setAdminSession(response) {
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    throw new Error('ADMIN_DASHBOARD_KEY is not configured.');
  }

  response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export function clearAdminSession(response) {
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}
