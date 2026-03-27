# Home Grown Money

Next.js storefront and admin dashboard for the Home Grown Money website.

## What is in this repo

- Public marketing site and landing page
- Product catalog with apparel and local menu sections
- Cart, checkout, and Stripe payment flow for shipping orders
- Contact form, legal page, FAQ, and shipping content
- Supabase-backed order storage, account bans, and admin dashboard

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and fill in real values:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment

The app supports:

- Supabase for order storage and account checks
- Stripe for card checkout
- Gmail SMTP or optional SMTP / Resend fallback for contact and order emails
- Optional Twilio alerts for local pickup and delivery notifications

Review [.env.example](./.env.example) before running locally or deploying.

## Important paths

- `app/` app router pages and API routes
- `components/` storefront UI, cart, splash, and shared sections
- `lib/` cart state, products, admin auth, Stripe, and server store logic
- `supabase/migrations/` database schema for orders and payment fields

## Deployment notes

- Production domain metadata currently points to `https://homegrownmoney.com`
- Git remote for this repo should be `https://github.com/blunts954-png/greenhome.git`
- Run `npm run build` before pushing deployment changes
