# Gift Shisha

Premium shisha & hookah delivery across Kenya. Built with Next.js 16, Tailwind CSS v4, and Supabase. Payments via M-Pesa STK Push.

## Features
- Modern dark shisha storefront with real product photography
- Hookah pipes, shisha flavours, charcoal, accessories & bundles
- Realistic Kenyan pricing in KES
- Working cart, checkout, and M-Pesa STK Push payment
- Order tracking and delivery zones (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and more)
- Free delivery on orders over KES 3,000
- Customer accounts (login/signup) with Supabase Auth
- Mobile-responsive design

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` — Safaricom Daraja API credentials
- `MPESA_PASSKEY` — Daraja passkey
- `MPESA_SHORTCODE` — defaults to sandbox `174379`
- `MPESA_ENV` — `sandbox` (default) or `production`
- `NEXT_PUBLIC_APP_URL` — your app URL (for M-Pesa callbacks)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role (server-side)

> **Note:** Without Supabase credentials the app still renders and lets you browse/add to cart (cart held in memory), but orders and M-Pesa calls will gracefully degrade.

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## Logo & icon
The site logo and favicon use `public/gs2.jpg` (your provided logo).

## M-Pesa testing
Use the Safaricom sandbox credentials and a test phone (e.g. `07XXXXXXXX`) in `sandbox` mode. Switch `MPESA_ENV=production` and use live credentials for real payments.

## Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
- Supabase (auth + database)
- Lucide React icons
