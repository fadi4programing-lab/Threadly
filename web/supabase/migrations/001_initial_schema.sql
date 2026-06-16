-- ============================================
-- Clothes Store Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. CATEGORIES
-- ============================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamptz default now()
);

-- ============================================
-- 2. PRODUCTS
-- ============================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price >= 0),
  category_id uuid references categories(id) on delete set null,
  images text[] default '{}',
  sizes text[] default '{}',
  colors text[] default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 3. ORDERS
-- ============================================
create type order_status as enum (
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  items jsonb not null default '[]',
  total numeric(10,2) not null check (total >= 0),
  status order_status default 'pending',
  address text not null,
  phone text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 4. WISHLIST
-- ============================================
create table wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ============================================
-- 5. REVIEWS
-- ============================================
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ============================================
-- 6. PROFILES (extends auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_products_category on products(category_id);
create index idx_products_active on products(is_active);
create index idx_products_featured on products(is_featured);
create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_wishlist_user on wishlist(user_id);
create index idx_reviews_product on reviews(product_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table wishlist enable row level security;
alter table reviews enable row level security;
alter table profiles enable row level security;

-- Categories: public read
create policy "Categories are viewable by everyone"
  on categories for select using (true);

-- ============================================
-- ADMIN HELPER: security definer function to avoid RLS recursion
-- ============================================
create or replace function public.is_admin(uid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where profiles.id = uid and profiles.role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Products: public read, admin write
create policy "Products are viewable by everyone"
  on products for select using (is_active = true);

create policy "Admins can insert products"
  on products for insert
  with check (public.is_admin(auth.uid()));

create policy "Admins can update products"
  on products for update
  using (public.is_admin(auth.uid()));

create policy "Admins can delete products"
  on products for delete
  using (public.is_admin(auth.uid()));

-- Orders: users see their own, admins see all
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on orders for select
  using (public.is_admin(auth.uid()));

create policy "Admins can update orders"
  on orders for update
  using (public.is_admin(auth.uid()));

-- Wishlist: users manage their own
create policy "Users can view their own wishlist"
  on wishlist for select
  using (auth.uid() = user_id);

create policy "Users can add to wishlist"
  on wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from wishlist"
  on wishlist for delete
  using (auth.uid() = user_id);

-- Reviews: public read, users manage their own
create policy "Reviews are viewable by everyone"
  on reviews for select using (true);

create policy "Users can create reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on reviews for delete
  using (auth.uid() = user_id);

-- Profiles: users see their own, admins see all
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin(auth.uid()));

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
