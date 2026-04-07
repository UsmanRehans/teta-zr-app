# TETA — Master Claude Code Kickoff Prompt
# Paste this entire prompt into Claude Code to begin the build.

---

You are building **Teta** — a two-sided home-cooked food marketplace for Beirut, Lebanon.
Think Uber Eats, but for home cooks (mostly women) selling authentic Lebanese food.
There is also a free-meal donation layer for community giving.

## What you are building right now (Phase 1 MVP)

A web application that:
- Lets home cooks sign up, create a profile, and list dishes with photos + pricing
- Lets customers browse cooks on a map, view dishes, and place orders
- Handles order status updates in real-time
- Uses phone number OTP login (no passwords)
- Supports cash on delivery only (no payment integration yet)
- Has a built-in AI agent (Teta Agent) that handles support and ops from day one

## Tech stack (do not deviate from this)

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB:** Supabase (Postgres + Auth + Storage + Realtime)
- **Maps:** Mapbox GL JS (free tier)
- **Deployment:** Vercel (free tier)
- **AI Agent:** Anthropic Claude API (claude-sonnet-4-6)
- **Push notifications:** Supabase Realtime (no extra service needed for Phase 1)
- **SMS OTP:** Supabase Auth with Twilio (configure in Supabase dashboard)

## Project structure to create

```
teta/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── verify/page.tsx
│   ├── (cook)/
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── listings/page.tsx
│   │   └── orders/page.tsx
│   ├── (customer)/
│   │   ├── browse/page.tsx
│   │   ├── cook/[id]/page.tsx
│   │   └── orders/page.tsx
│   ├── (admin)/
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   └── agent/route.ts        ← Teta AI Agent endpoint
│   ├── layout.tsx
│   └── page.tsx                  ← Landing page
├── components/
│   ├── map/CookMap.tsx
│   ├── listings/DishCard.tsx
│   ├── orders/OrderCard.tsx
│   ├── auth/PhoneLogin.tsx
│   └── agent/AgentChat.tsx       ← Floating AI support widget
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts              ← Generated from Supabase schema
│   ├── agent/
│   │   ├── teta-agent.ts         ← Core agent logic
│   │   └── tools.ts              ← Agent tools (query DB, update order, etc)
│   └── utils.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
├── .env.local.example
├── package.json
└── README.md
```

## Database schema — create this exact schema in Supabase

```sql
-- Run this in your Supabase SQL editor

-- Enable PostGIS for geolocation queries
create extension if not exists postgis;

-- Users (extended from Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  name text not null,
  phone text unique not null,
  role text check (role in ('cook', 'customer', 'both', 'admin')) default 'customer',
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Cook profiles (one per cook user)
create table public.cook_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) unique not null,
  location geography(Point, 4326),  -- lat/lng for map
  address_hint text,                -- e.g. "Hamra area" (not exact address)
  delivery_radius_km int default 2,
  accepts_orders boolean default true,
  specialties text[],
  verified boolean default false,
  avg_rating numeric(3,2) default 0,
  total_reviews int default 0,
  created_at timestamptz default now()
);

-- Dish listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  cook_id uuid references public.cook_profiles(id) not null,
  name text not null,
  description text,
  photo_urls text[],
  price_usd numeric(8,2),
  is_free boolean default false,
  portions_available int default 1,
  prep_time_mins int default 60,
  category text,
  allergens text[],
  dietary_tags text[],   -- ['vegan','halal','gluten-free']
  is_active boolean default true,
  pickup_only boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) not null,
  cook_id uuid references public.cook_profiles(id) not null,
  items jsonb not null,             -- [{listing_id, name, qty, price_usd}]
  total_usd numeric(8,2),
  is_free_claim boolean default false,
  status text check (status in (
    'pending','confirmed','preparing','ready','delivered','cancelled'
  )) default 'pending',
  delivery_type text check (delivery_type in ('pickup','delivery')) default 'pickup',
  delivery_address text,
  special_instructions text,
  payment_method text default 'cash',
  platform_fee_usd numeric(8,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages (per order chat)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) not null,
  sender_id uuid references public.profiles(id) not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) unique not null,
  reviewer_id uuid references public.profiles(id) not null,
  cook_id uuid references public.cook_profiles(id) not null,
  rating int check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now()
);

-- Agent logs (every AI action is logged)
create table public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid references public.profiles(id),
  user_message text not null,
  agent_response text not null,
  tools_used jsonb,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) — enable on all tables
alter table public.profiles enable row level security;
alter table public.cook_profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.agent_logs enable row level security;

-- Basic RLS policies (expand these as needed)
create policy "Users can read all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Anyone can view active listings" on public.listings for select using (is_active = true);
create policy "Cooks can manage own listings" on public.listings for all using (
  cook_id in (select id from public.cook_profiles where user_id = auth.uid())
);
create policy "Customers can view own orders" on public.orders for select using (
  customer_id = auth.uid() or
  cook_id in (select id from public.cook_profiles where user_id = auth.uid())
);
```

## Environment variables needed

Create `.env.local` with these (fill in from your dashboards):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Teta Agent — build this exactly

The agent lives at `app/api/agent/route.ts` and `lib/agent/teta-agent.ts`.
It uses the Claude API with tool use. It can:
- Look up order status
- Answer questions about the platform
- Help cooks with their listings
- Flag issues to admin
- Handle basic refund/cancellation requests

See `agents/TETA_AGENT_SPEC.md` for the full agent specification.

## Build order (do this sequentially)

1. `npx create-next-app@latest teta --typescript --tailwind --app`
2. Install dependencies: `npm install @supabase/supabase-js @supabase/ssr mapbox-gl @anthropic-ai/sdk`
3. Set up Supabase client (lib/supabase/client.ts and server.ts)
4. Run the database migration SQL in Supabase dashboard
5. Build PhoneLogin component and auth flow
6. Build cook profile creation page
7. Build listing creation with Supabase Storage photo upload
8. Build customer browse page with Mapbox map
9. Build order placement flow
10. Build Teta Agent API route and floating chat widget
11. Deploy to Vercel

## Design system

- Colors: primary green #1D9E75, warm cream #FDF6EC, dark text #1a1a1a
- Font: Inter (already in Next.js)
- Mobile-first — most Beirut users will be on phone browsers
- Arabic + English bilingual — add `dir="auto"` to text inputs
- Keep it warm, not corporate. This is a community app, not a bank.

## After each step, do this

1. Run `npm run dev`, check for TypeScript errors, verify it looks right on mobile viewport (375px wide).
2. Do not move to the next step until the current step works.
3. Update the status tracker (see below).

## Status tracking

After completing each build step, update these two files before moving on:

1. **`teta-build/status/BUILD_STATUS.md`** — Update the system's status, fill in dates, and update the Overall Progress header.
2. **`teta-build/status/BUILD_LOG.md`** — Prepend a new entry at the top with all 5 required sections:
   - What was built
   - Decisions made (and why)
   - Deviations from plan
   - Blockers
   - Lessons learned

See `teta-build/status/STATUS_TRACKING_SPEC.md` for the full entry template and rules.
The status update is a deliverable — treat it like code. Do not skip it.

---

Start with step 1. Create the Next.js project and install all dependencies.
Then immediately create the Supabase schema file at `supabase/migrations/001_initial_schema.sql`.
Tell me when both are done.
