-- Add FK from cart_items.product_id -> products.id
-- Run this after 001_initial_schema.sql if cart_items already exists

alter table public.cart_items
  drop constraint if exists cart_items_product_id_fkey;

alter table public.cart_items
  add constraint cart_items_product_id_fkey
  foreign key (product_id) references public.products(id) on delete cascade;