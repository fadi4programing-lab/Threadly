-- ============================================
-- Make your account an admin
-- Replace the email with yours if different
-- ============================================
UPDATE profiles SET role = 'admin' WHERE id = (
  SELECT id FROM auth.users WHERE email = 'testflow@test.com'
);

-- ============================================
-- Seed Categories
-- ============================================
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('T-Shirts', 't-shirts', 'Comfortable everyday tees', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
  ('Jeans', 'jeans', 'Classic denim for all occasions', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'),
  ('Jackets', 'jackets', 'Outerwear for every season', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'),
  ('Sneakers', 'sneakers', 'Step out in style', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
  ('Accessories', 'accessories', 'Complete your look', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400');

-- ============================================
-- Seed Products
-- ============================================
INSERT INTO products (name, description, price, sale_price, category_id, images, sizes, colors, stock, is_active, is_featured) VALUES
  ('Classic White Tee', 'A timeless white cotton t-shirt', 29.99, NULL, (SELECT id FROM categories WHERE slug='t-shirts'), ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], ARRAY['S','M','L','XL'], ARRAY['White','Black','Navy'], 50, true, true),
  ('Slim Fit Black Tee', 'Sleek black tee with slim fit', 34.99, 29.99, (SELECT id FROM categories WHERE slug='t-shirts'), ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'], ARRAY['S','M','L','XL'], ARRAY['Black','Charcoal'], 30, true, true),
  ('Vintage Graphic Tee', 'Retro-inspired graphic print tee', 39.99, NULL, (SELECT id FROM categories WHERE slug='t-shirts'), ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], ARRAY['M','L','XL'], ARRAY['Cream','Sage'], 25, true, false),
  ('Classic Blue Jeans', 'Relaxed fit blue denim jeans', 79.99, NULL, (SELECT id FROM categories WHERE slug='jeans'), ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'], ARRAY['28','30','32','34','36'], ARRAY['Blue','Dark Blue'], 40, true, true),
  ('Slim Black Jeans', 'Modern slim fit black jeans', 89.99, 69.99, (SELECT id FROM categories WHERE slug='jeans'), ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'], ARRAY['28','30','32','34'], ARRAY['Black'], 35, true, false),
  ('Denim Jacket', 'Classic denim jacket for layering', 119.99, NULL, (SELECT id FROM categories WHERE slug='jackets'), ARRAY['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600'], ARRAY['S','M','L','XL'], ARRAY['Blue','Light Blue'], 20, true, true),
  ('Bomber Jacket', 'Sleek bomber jacket for a modern look', 149.99, 129.99, (SELECT id FROM categories WHERE slug='jackets'), ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], ARRAY['M','L','XL'], ARRAY['Black','Olive','Navy'], 15, true, false),
  ('White Sneakers', 'Clean white leather sneakers', 99.99, NULL, (SELECT id FROM categories WHERE slug='sneakers'), ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], ARRAY['7','8','9','10','11'], ARRAY['White'], 60, true, true),
  ('Running Shoes', 'Lightweight performance running shoes', 129.99, 99.99, (SELECT id FROM categories WHERE slug='sneakers'), ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], ARRAY['7','8','9','10','11'], ARRAY['Black','Red','Blue'], 45, true, false),
  ('Leather Belt', 'Genuine leather belt with classic buckle', 49.99, NULL, (SELECT id FROM categories WHERE slug='accessories'), ARRAY['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600'], ARRAY['S','M','L'], ARRAY['Black','Brown'], 100, true, false),
  ('Canvas Tote Bag', 'Durable canvas tote for everyday use', 39.99, 29.99, (SELECT id FROM categories WHERE slug='accessories'), ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'], ARRAY['One Size'], ARRAY['Beige','Black','Navy'], 80, true, false),
  ('Baseball Cap', 'Classic snapback baseball cap', 24.99, NULL, (SELECT id FROM categories WHERE slug='accessories'), ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600'], ARRAY['One Size'], ARRAY['Black','White','Navy'], 70, true, true);
