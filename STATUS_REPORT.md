# Home Grown Money Status Report

Last updated: 2026-03-26

## Readiness

- Overall launch readiness: 92%
- Customer-facing readiness: 95%
- Production operations readiness: 88%

## Completed

- Home, shop, product detail, about, FAQ, shipping, legal, contact, and admin pages are in place.
- The app builds successfully with `npm run build`.
- The repo is pointed at the correct GitHub remote: `https://github.com/blunts954-png/greenhome.git`.
- SEO domain references now point to `https://homegrownmoney.com`.
- Local service language is aligned around Bakersfield pickup and delivery plus nationwide apparel shipping.
- Admin session auth is now env-driven instead of relying on built-in fallback credentials.
- Missing admin API routes were restored for dashboard data, order updates, and account ban management.
- Contact handling no longer points to an outside hardcoded inbox.
- Order alerts are prepared for admin email plus customer confirmation email once mail credentials are added.
- Old alias routes can now redirect cleanly:
  - `/connect` -> `/contact`
  - `/about-us` -> `/about`
  - `/our-story` -> `/about`

## Remaining External Blockers

- Stripe cannot go live until the customer provides:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Twilio cannot go live until the customer provides:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
  - admin alert destination numbers
- Contact and order emails cannot be sent until working mail credentials are provided:
  - Gmail app password, SMTP credentials, or Resend API key

## Remaining Code-Side Follow-Up

- Run a live end-to-end test after credentials are added:
  - contact form
  - admin login
  - shipping checkout with Stripe
  - local pickup/delivery order alert flow
- Replace any customer-owned placeholder inbox values in `.env.local` or deployment envs before launch.
- Confirm the exact production social links and service phone number with the customer.
