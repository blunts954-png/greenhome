# HGM Patch Manifest
## All 8 Fixes + Upgrades — April 2026

---

## How to Apply

Extract `hgm-patches.tar.gz` and copy each file into your repo at the matching path.
The folder structure inside the archive mirrors your project root exactly.

```bash
# From your project root:
tar xzf hgm-patches.tar.gz -C .
```

Then delete `netlify.toml` manually and delete `DELETE_netlify_toml.txt`.

---

## Files Changed (14 total)

### FIX 1 — Admin order/ban actions hit wrong endpoints
**File:** `app/coaiadmin/page.js`
- `handleOrderStatusUpdate` now hits `/api/coaiadmin/orders/{orderNumber}` instead of `/api/coaiadmin/dashboard`
- `handleBanToggle` now hits `/api/coaiadmin/accounts/{accountId}` instead of `/api/coaiadmin/dashboard`
- Both use proper `encodeURIComponent` for URL safety

### FIX 2 — Admin bootstrap POST → GET for session check
**File:** `app/coaiadmin/page.js` (same file as FIX 1)
- `useEffect` bootstrap now uses `GET /api/coaiadmin/session` to check existing auth
- `POST` is only used for actual login attempts with credentials
- Eliminates the false 401/503 on page load

### FIX 3 — `params` needs `await` in Next.js 14 dynamic routes
**File:** `app/api/coaiadmin/orders/[orderNumber]/route.js`
- Changed `{ params }` destructure to `context` parameter
- Added `const { orderNumber } = await context.params;`

**File:** `app/api/coaiadmin/accounts/[accountId]/route.js`
- Changed `{ params }` destructure to `context` parameter
- Added `const { accountId } = await context.params;`

### FIX 4 — ProductGrid CSS class mismatches
**File:** `components/ProductGrid.js`
- `styles.productCard` → `styles.card`
- `styles.pImg` → `styles.productImg`
- `styles.empty` → `styles.emptyState`
- Suspense fallback uses inline style instead of missing `.loading` class

### FIX 5 — Missing `legalHighlight` style
**File:** `components/Footer.module.css`
- Added `.legalHighlight` class with gold color, weight, and hover state

### FIX 6 — `storePicker` / `filters` class mismatches in ProductGrid
**File:** `components/ProductGrid.js` (same file as FIX 4)
- `styles.storePicker` → `styles.storeToggle`
- `styles.filters` → `styles.filterTabs`

**File:** `components/ProductGrid.module.css`
- Added margin-bottom to `.storeToggle` and `.filterTabs` for proper spacing
- Added `.header` wrapper class
- Added `.loading` class

### FIX 7 — `container` class used but undefined in ProductGrid
**File:** `components/ProductGrid.js` (same file as FIX 4/6)
- Removed `styles.container` wrapper div (section already has max-width via `.section`)

### UPGRADE 1 — Rate limiting on public API routes
**New file:** `lib/rate-limit.js`
- In-memory sliding-window rate limiter keyed by IP
- Periodic cleanup of stale entries
- Returns `{ limited, remaining, retryAfterMs }`

**File:** `app/api/contact/route.js` — 5 req/min per IP
**File:** `app/api/orders/route.js` — 10 req/min per IP
**File:** `app/api/stripe/payment-intent/route.js` — 8 req/min per IP
**File:** `app/api/accounts/check/route.js` — 15 req/min per IP
- All return 429 with `Retry-After` header when limited

### UPGRADE 4 — Inventory status always loads on public grid
**File:** `components/ProductGrid.js` (same file as FIX 4/6/7)
- Removed `NEXT_PUBLIC_ENABLE_MANAGEMENT_TERMINAL` env var gate
- Inventory status now always fetches from `/api/coaiadmin/inventory`
- Silently skips if endpoint isn't configured yet

### UPGRADE 5 — Remove `netlify.toml`
**File:** `DELETE_netlify_toml.txt` (instruction file)
- Delete `netlify.toml` from repo root — incompatible with Vercel + SSR

### UPGRADE 6 — Admin settings panel no longer leaks env var
**File:** `app/coaiadmin/page.js` (same file as FIX 1/2)
- Removed `process.env.ADMIN_DASHBOARD_USER` from client-rendered settings tab
- Replaced with static "HTTP-only cookie" label

### UPGRADE 7 — Admin CSS module fully aligned
**File:** `app/coaiadmin/page.module.css`
- Added missing classes: `.loadingScreen`, `.spinner`, `.brand`, `.nav`, `.navItem`, `.activeNav`, `.sidebarFooter`, `.searchWrap`
- Added inventory classes: `.inventoryGrid`, `.inventoryCard`, `.outOfStockCard`, `.invMedia`, `.invInfo`, `.invAction`, `.stockBtnIn`, `.stockBtnOut`
- Consolidated duplicate/conflicting selectors from the original

### UPGRADE 8 — BACKEND_SETUP.md includes inventory migration
**File:** `BACKEND_SETUP.md`
- Added Step 3 for `20260326_inventory_management.sql`
- Added note about deleting `netlify.toml`
- Added rate limiting to the "what works after deploy" section

---

## What's NOT in this patch (still needs customer action)

1. Live Stripe keys (pk_live, sk_live, whsec)
2. Gmail app password or SMTP/Resend credentials
3. Twilio SID + auth token + phone numbers
4. Final ADMIN_DASHBOARD_USER and ADMIN_DASHBOARD_KEY
5. Confirm social links (instagram.com/homegrownmoney, facebook.com/homegrownmoney)
6. Consider enabling Next.js image optimization (remove `unoptimized: true` from next.config.mjs)
7. Delete `netlify.toml` from repo root
8. Turn off `NEXT_PUBLIC_CHECKOUT_DEMO_MODE` in production env
