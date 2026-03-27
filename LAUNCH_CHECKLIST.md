# Home Grown Money Launch Checklist

## Already Done

- [x] Removed stray mixed-project branding from the tracked site source
- [x] Fixed production build errors
- [x] Normalized Bakersfield local fulfillment copy across the site
- [x] Pointed sitemap and robots to `homegrownmoney.com`
- [x] Replaced hardcoded contact inbox logic
- [x] Added admin API routes used by the dashboard
- [x] Switched admin auth to env-based credentials only
- [x] Added redirect pages for old path aliases
- [x] Created launch status documentation

## Customer Credentials Needed

- [ ] Add live Stripe keys
- [ ] Add Stripe webhook secret
- [ ] Add Twilio account credentials
- [ ] Add Twilio phone number and alert recipients
- [ ] Add Gmail app password, SMTP credentials, or Resend API key
- [ ] Confirm final admin username and password for production

## Before Going Live

- [ ] Set `ADMIN_DASHBOARD_USER`
- [ ] Set `ADMIN_DASHBOARD_KEY`
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set `CONTACT_TO_EMAIL`
- [ ] Set `ORDER_ALERT_TO_EMAIL`
- [ ] Set `ENABLE_CUSTOMER_ORDER_EMAIL=true`
- [ ] Confirm `NEXT_PUBLIC_CHECKOUT_DEMO_MODE` is off in production

## Final QA

- [ ] Submit a contact form and verify delivery
- [ ] Log into `/admin`
- [ ] Create a local pickup order
- [ ] Create a local delivery order
- [ ] Run one Stripe shipping checkout
- [ ] Confirm admin alert email arrives
- [ ] Confirm customer order confirmation email arrives
- [ ] Confirm Twilio alerts arrive for local orders if enabled
- [ ] Verify legal, FAQ, shipping, and product pages on mobile
