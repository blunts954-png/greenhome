import 'server-only';

/**
 * Simple in-memory sliding-window rate limiter.
 * 
 * Each bucket tracks request timestamps per key (usually IP).
 * Not shared across serverless instances — provides best-effort
 * protection against single-origin spam, not distributed attacks.
 * 
 * For production at scale, swap this for Redis or Vercel KV.
 */

const buckets = new Map();

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 10;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Periodic cleanup of stale keys
let cleanupScheduled = false;

function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;

  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of buckets.entries()) {
      const filtered = timestamps.filter((t) => now - t < DEFAULT_WINDOW_MS * 5);
      if (filtered.length === 0) {
        buckets.delete(key);
      } else {
        buckets.set(key, filtered);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

/**
 * Check if a request key (IP) is rate-limited.
 *
 * @param {string} key - The rate limit key (IP address, email, etc.)
 * @param {object} options
 * @param {number} options.windowMs - Time window in ms (default: 60000)
 * @param {number} options.maxRequests - Max allowed in window (default: 10)
 * @returns {{ limited: boolean, remaining: number, retryAfterMs: number }}
 */
export function checkRateLimit(key, options = {}) {
  const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;
  const now = Date.now();

  scheduleCleanup();

  if (!buckets.has(key)) {
    buckets.set(key, []);
  }

  const timestamps = buckets.get(key);
  const windowStart = now - windowMs;

  // Remove expired entries
  const active = timestamps.filter((t) => t > windowStart);
  buckets.set(key, active);

  if (active.length >= maxRequests) {
    const oldestInWindow = active[0];
    const retryAfterMs = oldestInWindow + windowMs - now;

    return {
      limited: true,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 1000)
    };
  }

  active.push(now);

  return {
    limited: false,
    remaining: maxRequests - active.length,
    retryAfterMs: 0
  };
}

/**
 * Get the client IP from a Next.js request for rate-limit keying.
 */
export function getRateLimitKey(request, prefix = '') {
  const forwarded =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-forwarded-for');

  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return prefix ? `${prefix}:${ip}` : ip;
}
