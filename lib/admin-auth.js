import 'server-only';

import crypto from 'node:crypto';

const ADMIN_COOKIE_NAME = 'hgm_admin_session';

function getAdminKey() {
  return process.env.ADMIN_DASHBOARD_KEY || 'HGM2026';
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest();
}

function safeCompare(left = '', right = '') {
  return crypto.timingSafeEqual(sha256(left), sha256(right));
}

export function isValidAdminPassword(password = '') {
  return safeCompare(password, getAdminKey());
}

function getSessionToken() {
  return crypto
    .createHash('sha256')
    .update(`${getAdminKey()}::hgm-admin-session`)
    .digest('hex');
}

export function hasAdminSession(request) {
  const value = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!value) {
    return false;
  }

  return safeCompare(value, getSessionToken());
}

export function setAdminSession(response) {
  response.cookies.set(ADMIN_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.VERCEL === '1',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export function clearAdminSession(response) {
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.VERCEL === '1',
    path: '/',
    maxAge: 0
  });
}
