import 'server-only';

import crypto from 'node:crypto';

const ADMIN_COOKIE_NAME = 'hgm_admin_session';
const DEFAULT_ADMIN_USER = 'homegrownmoney';
const DEFAULT_ADMIN_PASS = 'Bakersfield2026';

function getAcceptedAdminUsers() {
  const envUser = process.env.ADMIN_DASHBOARD_USER?.trim();

  return [DEFAULT_ADMIN_USER, envUser].filter(Boolean);
}

function getAcceptedAdminPasswords() {
  const envPass = process.env.ADMIN_DASHBOARD_KEY?.trim();

  return [DEFAULT_ADMIN_PASS, envPass].filter(Boolean);
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

export function isValidAdminCredentials(username = '', password = '') {
  if (!username || !password) {
    return false;
  }

  const userMatch = getAcceptedAdminUsers().some((u) => u.toLowerCase() === username.toLowerCase());
  const passMatch = getAcceptedAdminPasswords().some((p) => safeCompare(password, p));

  return userMatch && passMatch;
}

function getSessionToken() {
  return crypto
    .createHash('sha256')
    .update(`${DEFAULT_ADMIN_PASS}::hgm-admin-session`)
    .digest('hex');
}

export function hasAdminSession(request) {
  const value = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const sessionToken = getSessionToken();

  if (!value) {
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
