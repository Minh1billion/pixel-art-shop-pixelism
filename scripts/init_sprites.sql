BEGIN;

INSERT INTO sprites (id, cloudinary_id, created_at, image_url, is_active, name, slug, updated_at, created_by)
VALUES
  ('4504b579-1ea4-46d3-b8d4-738f4fd78cad', 'sprites/y6gdrcshr58xecsdioqu', '2026-02-23 03:27:25.788872', 'https://res.cloudinary.com/dc18ql4cw/image/upload/v1771817244/sprites/y6gdrcshr58xecsdioqu.jpg', true, 'Town Vendor', 'town-vendor', '2026-02-23 03:27:25.788933', '18582295-d0c9-4b72-b1f7-729d6a91e21a'),
  ('930fee6f-b4f1-431d-ad62-e8b7fb2ac7d9', 'sprites/ehjrz2b8srszk7ukk2uh', '2026-02-23 03:25:13.331508', 'https://res.cloudinary.com/dc18ql4cw/image/upload/v1771817112/sprites/ehjrz2b8srszk7ukk2uh.png', true, 'Green Slime', 'green-slime', '2026-02-23 03:25:13.331525', '18582295-d0c9-4b72-b1f7-729d6a91e21a'),
  ('d52ad244-5805-4951-abd0-fac162eef5ee', 'sprites/yxailzzo3jhtxidgsvj4', '2026-02-23 03:26:06.014025', 'https://res.cloudinary.com/dc18ql4cw/image/upload/v1771817165/sprites/yxailzzo3jhtxidgsvj4.jpg', true, 'Town Girl with Flower Basket', 'town-girl-with-flower-basket', '2026-02-23 03:26:06.014073', '18582295-d0c9-4b72-b1f7-729d6a91e21a'),
  ('f0955a53-4f4d-4357-86fd-dfa4dcae616b', 'sprites/zrsc6xbjopwh6phiezxu', '2026-02-23 03:26:41.022746', 'https://res.cloudinary.com/dc18ql4cw/image/upload/v1771817201/sprites/zrsc6xbjopwh6phiezxu.jpg', true, 'Woman Lifting a Basket of Fruits', 'woman-lifting-a-basket-of-fruits', '2026-02-23 03:26:41.022807', '18582295-d0c9-4b72-b1f7-729d6a91e21a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sprite_categories (sprite_id, category_id)
VALUES
  ('4504b579-1ea4-46d3-b8d4-738f4fd78cad', '2f28c226-ee02-4c80-9b8a-eac2c7987cf2'),
  ('4504b579-1ea4-46d3-b8d4-738f4fd78cad', '7b995848-3d03-4944-b458-10e0e7234fc6'),
  ('4504b579-1ea4-46d3-b8d4-738f4fd78cad', 'a113bec2-04da-42ce-a5c2-63e85dbf5266'),
  ('4504b579-1ea4-46d3-b8d4-738f4fd78cad', 'a505da6e-a2b3-46b3-a297-71315de6caf6'),
  ('930fee6f-b4f1-431d-ad62-e8b7fb2ac7d9', '1e3bb620-c8a8-4392-a6f2-b8a9a2864db1'),
  ('930fee6f-b4f1-431d-ad62-e8b7fb2ac7d9', '99e2ed11-c9ae-4f40-bbd7-7d33cba2a504'),
  ('930fee6f-b4f1-431d-ad62-e8b7fb2ac7d9', 'e5f8a9c3-1b2d-4c6e-9f7a-8b9c0d1e2f3a'),
  ('d52ad244-5805-4951-abd0-fac162eef5ee', '1e3bb620-c8a8-4392-a6f2-b8a9a2864db1'),
  ('d52ad244-5805-4951-abd0-fac162eef5ee', 'e5f8a9c3-1b2d-4c6e-9f7a-8b9c0d1e2f3a'),
  ('f0955a53-4f4d-4357-86fd-dfa4dcae616b', '1e3bb620-c8a8-4392-a6f2-b8a9a2864db1'),
  ('f0955a53-4f4d-4357-86fd-dfa4dcae616b', 'e5f8a9c3-1b2d-4c6e-9f7a-8b9c0d1e2f3a')
ON CONFLICT DO NOTHING;

COMMIT;