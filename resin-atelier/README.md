# Resin Atelier

A premium, handmade-aesthetic e-commerce storefront for a resin art business — custom resin keychains, name keychains, photo frames and couple/wedding keepsakes. Built with Next.js 14 (App Router + TypeScript), Tailwind CSS, Prisma/PostgreSQL, and NextAuth.

## Features

- **Storefront**: homepage, category-filterable shop, product detail pages with live customization (name, color, glitter, photo upload, message, notes), cart, guest/account checkout, order success page, about, contact, FAQ.
- **Customer accounts**: email/password auth (NextAuth + bcrypt), order history, order detail with customization recap.
- **Admin dashboard**: revenue/order/stock stats, product CRUD with image upload and inline category creation, order list/detail with status updates, manual payment verification.
- **Payments**: manual UPI payments — checkout shows a scannable QR code and the store's UPI ID, the customer pays with any UPI app and optionally submits their transaction reference, and the admin verifies and confirms the order from the dashboard. No payment gateway, no gateway fees, no API keys required.
- **Design**: cream / blush / lavender / gold palette, Playfair Display + Poppins fonts, Framer Motion animations, WhatsApp floating button, Instagram-style gallery, testimonials, FAQ accordion.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Supabase-compatible) via Prisma ORM |
| Auth | NextAuth (Credentials provider, JWT sessions) |
| Payments | Manual UPI (QR code + UPI ID, admin-verified) |
| State | Zustand (cart, persisted to localStorage) |
| Forms | react-hook-form + zod |
| Animation | Framer Motion |

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A PostgreSQL database — either [Supabase](https://supabase.com) (free tier works well) or any Postgres instance / Docker container.
- A UPI ID to receive payments (any personal or business UPI handle works, e.g. from Google Pay, PhonePe, or your bank's app).

### 2. Install dependencies

```bash
npm install
```

### 2a. Local Postgres on macOS (no Homebrew required)

This project was set up locally using **[Postgres.app](https://postgresapp.com)** — a self-contained Postgres bundle that needs no `sudo` or Homebrew. It's already installed and running for this project's dev database. To manage it:

```bash
# Start the server (already running after initial setup)
/Applications/Postgres.app/Contents/Versions/16/bin/pg_ctl -D ~/.resin-atelier-pgdata -l ~/.resin-atelier-pgdata/logfile start

# Stop the server
/Applications/Postgres.app/Contents/Versions/16/bin/pg_ctl -D ~/.resin-atelier-pgdata stop

# Connect with psql
/Applications/Postgres.app/Contents/Versions/16/bin/psql -h localhost -p 5432 -d resin_atelier
```

The data directory lives at `~/.resin-atelier-pgdata` and the server listens on `localhost:5432` with trust authentication for your macOS user (no password) — fine for local dev, not for production. `.env` is already configured to point at it: `DATABASE_URL="postgresql://<your-macos-username>@localhost:5432/resin_atelier?schema=public"`.

If you'd rather use Homebrew (`brew install postgresql@16`) or a hosted Supabase database instead, just update `DATABASE_URL` accordingly — everything else in this guide stays the same.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `DATABASE_URL` — your Postgres connection string (Supabase: Project Settings → Database → Connection string → URI).
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`.
- `NEXT_PUBLIC_UPI_ID` — the UPI ID customers will pay at checkout (shown as text and encoded into the QR code).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials the seed script uses to create your first admin user.

### 4. Set up the database

```bash
npm run db:push    # creates tables from prisma/schema.prisma
npm run db:seed    # creates an admin user, demo customer, categories, sample products, testimonials, gallery & FAQ
```

For schema changes going forward, prefer `npm run db:migrate` to keep migration history.

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in to `/admin` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

### 6. How the UPI payment flow works

There's no payment gateway integration — checkout is a two-step, admin-verified UPI flow:

1. The customer fills in their shipping details and places the order (`POST /api/checkout`). This creates the `Order` and a `Payment` row with `status: PENDING`, and decrements stock immediately.
2. They land on a payment step showing a QR code (generated client-side from a `upi://pay` deep link) and the raw UPI ID, plus an optional field to enter their UPI transaction reference (UTR) once they've paid. Submitting that calls `POST /api/checkout/confirm-payment`, which just records what the customer told us — it does **not** mark the order as paid.
3. In `/admin/orders/[id]`, you check the incoming transfer against your actual UPI app or bank statement, then click **Mark Payment Received** (or **Mark Failed**). This calls `POST /api/admin/orders/[id]/verify-payment`, which is the only place `Payment.status` actually becomes `PAID`, and auto-advances the order to `CONFIRMED`.

Because there's no gateway callback, payment verification is inherently manual — budget for checking incoming UPI payments before shipping orders.

### 6a. WhatsApp order notifications

When a customer confirms payment (step 2 above), the site sends you a WhatsApp message with their order details and delivery address, so you don't have to keep checking the admin dashboard. This uses Meta's free WhatsApp Cloud API:

1. Go to [developers.facebook.com](https://developers.facebook.com), sign in, and create an app of type "Business".
2. In the app dashboard, add the **WhatsApp** product.
3. Under **WhatsApp > API Setup** you'll see a test phone number and a temporary access token. Note the **Phone Number ID** shown there.
4. In the same page, under "To" / recipient numbers, add your own personal WhatsApp number and verify it with the OTP Meta sends — this lets the test number message you.
5. For a token that doesn't expire every 24 hours: go to **Business Settings > Users > System Users**, create a system user, generate a permanent token for it with the `whatsapp_business_messaging` permission.
6. Add these to `.env`:
   ```
   WHATSAPP_ACCESS_TOKEN="<your permanent token>"
   WHATSAPP_PHONE_NUMBER_ID="<phone number id from step 3>"
   ADMIN_WHATSAPP_NUMBER="<your number, country code + number, no + or spaces, e.g. 917661008991>"
   ```
7. Restart the dev server. If any of these are unset, notification sending is silently skipped (checkout still works) — check the server logs if a message doesn't arrive.

This sends free-form text, which Meta only allows to numbers you've explicitly added as test recipients in the dashboard — that's fine here since the only recipient is you, the shop owner. It does not require Meta business verification or "going live."

### 6b. Email order notifications

Alongside (or instead of) WhatsApp, the site can email you the same order details via Gmail SMTP using an [App Password](https://myaccount.google.com/apppasswords) — no paid email service needed:

1. Turn on 2-Step Verification on the Gmail account you want to send from, if it isn't already.
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), create an app password (name it e.g. "Resin Atelier"), and copy the 16-character password.
3. Add these to `.env`:
   ```
   EMAIL_USER="youraddress@gmail.com"
   EMAIL_APP_PASSWORD="<the 16-character app password, no spaces>"
   ```
4. Restart the dev server. Notification emails are sent to `ADMIN_EMAIL`. If `EMAIL_USER` or `EMAIL_APP_PASSWORD` is unset, sending is silently skipped (checkout still works) — check the server logs if an email doesn't arrive.

Both notifications fire from the same event (`POST /api/checkout/confirm-payment`, right after the customer says they've paid) and are independent — set up one, both, or neither.

### 7. Image uploads

Product images and customer photo uploads are stored locally under `public/uploads` by default — fine for development, but **ephemeral on most hosting platforms** (files won't survive a redeploy). For production, swap the storage in `src/app/api/upload/route.ts` for a persistent object store such as Supabase Storage, Cloudinary, or S3.

## Project Structure

```
src/
  app/                 # App Router pages & API routes
    (storefront pages) # /, /shop, /product/[slug], /cart, /checkout, /about, /contact, /faq, /login, /register, /account
    admin/              # Admin dashboard (products, orders, stats)
    api/                # Route handlers (auth, products, orders, checkout, upload, admin)
  components/           # Shared UI components
  components/admin/     # Admin-only components
  lib/                  # Prisma client, auth config, UPI helper, validation schemas, utils
  store/                # Zustand cart store
  types/                # Shared TypeScript types
prisma/
  schema.prisma         # Data model
  seed.ts                # Seed script
```

## Data Model Highlights

- `Product` stores price in **paise** (smallest INR unit) to avoid floating-point rounding; `formatINR()` in `src/lib/utils.ts` handles display formatting.
- `OrderItem` stores a full snapshot of the customization chosen at checkout (name, color, glitter, message, photo URL, notes) so historical orders remain accurate even if the product is later edited.
- `Payment` is 1:1 with `Order` and tracks the UPI method, the customer-submitted UTR/reference, and a `status` (`PENDING → PAID`/`FAILED`) that only the admin can advance — independent of order fulfillment status.
- `Order.status` is the fulfillment lifecycle (`PENDING_PAYMENT → CONFIRMED → IN_PROGRESS → READY_TO_SHIP → SHIPPED → DELIVERED`, plus `CANCELLED` / `REFUNDED`), editable from the admin dashboard.

## Security Notes

- Passwords are hashed with bcrypt; sessions are JWT-based via NextAuth.
- `/admin/*` and `/account/*` are protected by `src/middleware.ts`; admin API routes additionally check `role === "ADMIN"` server-side.
- Checkout totals are always recomputed server-side from the database — client-submitted prices are never trusted.
- File uploads are restricted by MIME type and size (5MB) and written with randomly generated filenames.
- The `/api/checkout/confirm-payment` endpoint is intentionally public (guests use it too) but only ever writes the customer-submitted UTR/reference — it can never set `Payment.status` to `PAID`. Only the authenticated admin-only `/api/admin/orders/[id]/verify-payment` endpoint can do that.

## Known Follow-ups for Production

- Replace local-disk image storage with a persistent object store (see step 7 above).
- Next.js is pinned to the latest patched `14.2.x` release; consider upgrading to Next 15/16 on your own schedule and re-running `npm audit`.
- Add a transactional email/SMS provider (e.g. Resend/SendGrid, Twilio) to notify customers when their payment is verified or their order status changes — hooks are already in place at the points where that happens (`/api/admin/orders/[id]/verify-payment`, `/api/orders/[id]` PATCH).
- Consider adding a reminder flow (email/WhatsApp) for orders left in `PENDING_PAYMENT` for too long, since there's no automatic payment timeout with manual UPI.
- Testimonials submitted by customers are created with `isApproved: false`; wire up a moderation view in the admin dashboard before enabling that flow publicly.
