-- ============================================
-- Fix: Infinite recursion in admin RLS policies
-- The admin policies queried profiles table, causing recursive policy evaluation
-- Solution: Use a security definer function to break the recursion
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop recursive admin policies
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Admins can insert products" on products;
drop policy if exists "Admins can update products" on products;
drop policy if exists "Admins can delete products" on products;
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;

-- Create a security definer function to check admin status
-- SECURITY DEFINER runs with the function owner's privileges, bypassing RLS
create or replace function public.is_admin(uid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where profiles.id = uid and profiles.role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Products: admin write (using is_admin)
create policy "Admins can insert products"
  on products for insert
  with check (public.is_admin(auth.uid()));

create policy "Admins can update products"
  on products for update
  using (public.is_admin(auth.uid()));

create policy "Admins can delete products"
  on products for delete
  using (public.is_admin(auth.uid()));

-- Orders: admin read/write (using is_admin)
create policy "Admins can view all orders"
  on orders for select
  using (public.is_admin(auth.uid()));

create policy "Admins can update orders"
  on orders for update
  using (public.is_admin(auth.uid()));

-- Profiles: admin read (using is_admin)
create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin(auth.uid()));
