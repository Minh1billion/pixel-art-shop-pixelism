CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_sprite_name_trgm ON sprites USING GIN (name gin_trgm_ops);
CREATE INDEX idx_asset_pack_name_trgm ON asset_pack USING GIN (name gin_trgm_ops);

CREATE INDEX idx_sprite_created_by ON sprites (created_by);
CREATE INDEX idx_sprite_created_at ON sprites (created_at DESC);
CREATE INDEX idx_sprite_active_created_at ON sprites (is_active, created_at DESC);
CREATE INDEX idx_sprite_active_created_by ON sprites (is_active, created_by);

CREATE INDEX idx_asset_pack_active ON asset_pack (is_active);
CREATE INDEX idx_asset_pack_name ON asset_pack (name);
CREATE INDEX idx_asset_pack_price ON asset_pack (price);
CREATE INDEX idx_asset_pack_created_by ON asset_pack (created_by);
CREATE INDEX idx_asset_pack_created_at ON asset_pack (created_at DESC);
CREATE INDEX idx_asset_pack_active_created_at ON asset_pack (is_active, created_at DESC);
CREATE INDEX idx_asset_pack_active_price ON asset_pack (is_active, price);

CREATE INDEX idx_asset_pack_sprites_pack ON asset_pack_sprites (asset_pack_id);
CREATE INDEX idx_asset_pack_sprites_sprite ON asset_pack_sprites (sprite_id);