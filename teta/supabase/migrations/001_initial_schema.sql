-- Teta MVP Schema
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
  location geography(Point, 4326),
  address_hint text,
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
  dietary_tags text[],
  is_active boolean default true,
  pickup_only boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) not null,
  cook_id uuid references public.cook_profiles(id) not null,
  items jsonb not null,
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

-- RLS policies
create policy "Users can read all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Anyone can view cook profiles" on public.cook_profiles for select using (true);
create policy "Cooks can manage own cook profile" on public.cook_profiles for all using (user_id = auth.uid());

create policy "Anyone can view active listings" on public.listings for select using (is_active = true);
create policy "Cooks can manage own listings" on public.listings for all using (
  cook_id in (select id from public.cook_profiles where user_id = auth.uid())
);

create policy "Users can view own orders" on public.orders for select using (
  customer_id = auth.uid() or
  cook_id in (select id from public.cook_profiles where user_id = auth.uid())
);
create policy "Customers can create orders" on public.orders for insert with check (customer_id = auth.uid());
create policy "Order participants can update" on public.orders for update using (
  customer_id = auth.uid() or
  cook_id in (select id from public.cook_profiles where user_id = auth.uid())
);

create policy "Order participants can view messages" on public.messages for select using (
  order_id in (select id from public.orders where customer_id = auth.uid() or
    cook_id in (select id from public.cook_profiles where user_id = auth.uid()))
);
create policy "Order participants can send messages" on public.messages for insert with check (
  sender_id = auth.uid()
);

create policy "Anyone can view reviews" on public.reviews for select using (true);
create policy "Customers can create reviews" on public.reviews for insert with check (reviewer_id = auth.uid());

create policy "Users can view own agent logs" on public.agent_logs for select using (user_id = auth.uid());
create policy "Service role can insert agent logs" on public.agent_logs for insert with check (true);
