-- Gift Shisha Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Profiles table (user profiles linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  phone text,
  email text,
  location text default 'Nairobi CBD',
  location_detail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Categories table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Products table
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  category text,
  image_url text,
  is_available boolean default true,
  stock integer default 0,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Orders table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id text,
  vendor_id uuid,
  status text default 'pending',
  total numeric not null default 0,
  delivery_fee numeric default 0,
  delivery_address text default '',
  delivery_location text,
  payment_method text default 'mpesa',
  mpesa_receipt text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Order items table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric not null default 0,
  total_price numeric not null default 0
);

-- 7. Cart items table
create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Payment transactions table (M-Pesa)
create table if not exists public.payment_transactions (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id),
  checkout_request_id text unique,
  merchant_request_id text,
  mpesa_receipt_number text,
  amount numeric,
  phone_number text,
  status text default 'pending',
  result_code text,
  result_desc text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;
alter table public.payment_transactions enable row level security;

-- 10. RLS Policies
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select using (true);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select using (auth.uid()::text = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid()::text = user_id);

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()::text)
);

drop policy if exists "Users can manage own cart" on public.cart_items;
create policy "Users can manage own cart" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can view own transactions" on public.payment_transactions;
create policy "Users can view own transactions" on public.payment_transactions for select using (
  exists (select 1 from public.orders where orders.id = payment_transactions.order_id and orders.user_id = auth.uid()::text)
);

-- 11. Default Categories
insert into public.categories (name, slug) values
  ('Hookah Pipes', 'pipes'),
  ('Shisha Flavours', 'flavours'),
  ('Charcoal & Heat', 'charcoal'),
  ('Accessories', 'accessories'),
  ('Bundles', 'bundles')
on conflict (slug) do nothing;
