-- Gift Shisha Supabase Schema (idempotent)
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  phone text,
  email text,
  location text,
  location_detail text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products table
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  category text,
  image_url text,
  is_available boolean default true,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
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

-- Order items table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric not null default 0,
  total_price numeric not null default 0
);

-- Cart items table
create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  product_id uuid not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payment transactions table
create table if not exists public.payment_transactions (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id),
  checkout_request_id text,
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

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;
alter table public.payment_transactions enable row level security;

-- Grant privileges to anon and service_role (fixes "permission denied")
grant select on public.categories to anon;
grant select on public.products to anon;
grant select, insert, update, delete on public.profiles to anon;
grant select, insert on public.orders to anon;
grant select on public.order_items to anon;
grant select, insert, update, delete on public.cart_items to anon;
grant select on public.payment_transactions to anon;

grant all privileges on all tables in schema public to service_role;

-- RLS Policies (idempotent)
drop policy if exists "Public read access for categories" on public.categories;
drop policy if exists "Public read access for products" on public.products;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Users can manage own cart items" on public.cart_items;
drop policy if exists "Users can view own payment transactions" on public.payment_transactions;

create policy "Public read access for categories"
  on public.categories for select using (true);

create policy "Public read access for products"
  on public.products for select using (true);

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid()::text = id::text);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid()::text = id::text);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid()::text = id::text);

create policy "Users can view own orders"
  on public.orders for select using (auth.uid()::text = user_id::text);

create policy "Users can insert own orders"
  on public.orders for insert with check (auth.uid()::text = user_id::text);

create policy "Users can view own order items"
  on public.order_items for select using (exists (
    select 1 from public.orders where orders.id::text = order_items.order_id::text and orders.user_id::text = auth.uid()::text
  ));

create policy "Users can manage own cart items"
  on public.cart_items for all using (auth.uid()::text = user_id::text) with check (auth.uid()::text = user_id::text);

create policy "Users can view own payment transactions"
  on public.payment_transactions for select using (exists (
    select 1 from public.orders where orders.id::text = payment_transactions.order_id::text and orders.user_id::text = auth.uid()::text
  ));

-- Insert default categories
insert into public.categories (name, slug, image_url) values
  ('Hookah Pipes', 'pipes', null),
  ('Shisha Flavours', 'flavours', null),
  ('Charcoal & Heat', 'charcoal', null),
  ('Accessories', 'accessories', null),
  ('Bundles', 'bundles', null)
on conflict (slug) do nothing;