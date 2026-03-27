import 'server-only';

import crypto from 'node:crypto';

const ADMIN_COOKIE_NAME = 'hgm_admin_session';

function getAdminUser() {
  return process.env.ADMIN_DASHBOARD_USER?.trim() || '';
}

function getAdminPassword() {
  return process.env.ADMIN_DASHBOARD_KEY?.trim() || '';
}

export function isAdminConfigured() {
  return Boolean(getAdminUser() && getAdminPassword());
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest();
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function safeCompare(left = '', right = '') {
  return crypto.timingSafeEqual(sha256(left), sha256(right));
}

export function isValidAdminCredentials(username = '', password = '') {
  const adminUser = getAdminUser();
  const adminPassword = getAdminPassword();

  if (!adminUser || !adminPassword || !username || !password) {
    return false;
  }

  const userMatch = adminUser.toLowerCase() === username.toLowerCase();
  const passMatch = safeCompare(password, adminPassword);

  return userMatch && passMatch;
}

function getSessionToken() {
  const adminUser = getAdminUser();
  const adminPassword = getAdminPassword();

  if (!adminUser || !adminPassword) {
    return null;
  }

  return sha256Hex(`${adminUser}::${adminPassword}::hgm-admin-session`);
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
    throw new Error('Admin credentials are not configured.');
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
