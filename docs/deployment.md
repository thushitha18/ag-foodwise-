# FoodWise Deployment Guide

This document covers production deployment of FoodWise to **Vercel** with a **Supabase PostgreSQL** database.

---

## 1. Prerequisites
- Node.js 20.x or higher
- A GitHub repository containing the FoodWise project
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account

---

## 2. Database Setup (Supabase)
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Name your project (e.g. `foodwise-prod`), select a secure database password, and choose your preferred region (e.g., `ap-south-1` Mumbai).
3. Once the database is provisioned, navigate to the **SQL Editor** in the left sidebar.
4. Click **New Query**, paste the contents of `supabase_schema.sql` located at the root of this project, and click **Run**.
5. This initializes all tables (`users`, `providers`, `individual_sellers`, `rescue_partners`, `food_listings`, `orders`, `complaints`, `qr_claims`, etc.) along with appropriate foreign keys and performance indexes.

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local` for local development or input the variables into the Vercel dashboard:

| Variable | Description | Required? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Canonical URL of your deployment (e.g. `https://foodwise.vercel.app`) | Yes |
| `NEXT_PUBLIC_DEFAULT_CITY` | Default geographic hub (`Coimbatore` or `Chennai`) | Optional |
| `NEXT_PUBLIC_DEFAULT_LAT` | Default hub latitude (e.g. `11.0168`) | Optional |
| `NEXT_PUBLIC_DEFAULT_LNG` | Default hub longitude (e.g. `76.9558`) | Optional |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project API URL | Optional (built-in fallback exists) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project `anon` `public` key | Optional (built-in fallback exists) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` secret (server-side only) | Optional |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Optional Mapbox public access token | Optional (graceful Leaflet fallback) |
| `ML_SERVICE_URL` | Optional external Python scikit-learn endpoint | Optional |

> **Note:** FoodWise is architected with dual-mode resilience. If Supabase or Mapbox keys are not configured, the platform operates seamlessly using local storage and in-memory mock datasets.

---

## 4. Vercel Deployment Steps
1. Navigate to [Vercel Dashboard](https://vercel.com).
2. Click **Add New** → **Project** and import your Git repository.
3. Framework Preset: Select **Next.js**.
4. Build & Output Settings:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Expand **Environment Variables** and paste the keys listed in Section 3 above.
6. Click **Deploy**. Vercel will build and assign a production URL.

---

## 5. Seed / Demo Accounts Verification
After deployment, test the 5 role personas using the demo credentials:

| Role | Demo Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Consumer** | `consumer@foodwise.demo` | `Demo@1234` | `/consumer` |
| **Provider** | `provider@foodwise.demo` | `Demo@1234` | `/provider` |
| **Individual Seller** | `seller@foodwise.demo` | `Demo@1234` | `/individual-seller` |
| **Rescue Partner** | `rescue@foodwise.demo` | `Demo@1234` | `/rescue` |
| **Platform Admin** | `admin@foodwise.demo` | `Demo@1234` | `/admin` |

---

## 6. Production Health Check
1. Visit `https://your-domain.com/` — Verify homepage loads with Coimbatore/Chennai selector.
2. Visit `/join` — Verify account registration, login, and forgot password flows.
3. Visit `/consumer` — Verify search, category filters, distance badges, and reservation buttons.
4. Visit `/individual-seller` — Verify sell vs donate flow and food safety notice.
5. Visit `/rescue` — Verify unverified user gate and `/rescue/apply` accreditation flow.
6. Visit `/orders/ord-1/track` — Verify order timeline and simulated demo tracking map.
7. Visit `/complaints` and `/admin/complaints` — Verify complaint ticketing lifecycle.
8. Visit `/technology` — Verify interactive technology cards.
9. Visit `/demo` — Verify interactive 50 Veg Meals simulation lifecycle with Reset Demo.
