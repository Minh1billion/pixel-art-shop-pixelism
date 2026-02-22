CREATE INDEX idx_sprite_price 
ON sprites (price);

CREATE INDEX idx_sprite_active 
ON sprites (is_active);

CREATE INDEX idx_sprite_name 
ON sprites (name);

CREATE INDEX idx_sprite_category_sprite
ON sprite_categories(sprite_id);

CREATE INDEX idx_sprite_category_category
ON sprite_categories(category_id);