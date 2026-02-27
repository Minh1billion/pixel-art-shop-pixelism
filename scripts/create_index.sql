CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Sprites
CREATE INDEX idx_sprite_name_trgm ON sprites USING GIN (name gin_trgm_ops);
CREATE INDEX idx_sprite_created_by ON sprites (created_by);
CREATE INDEX idx_sprite_created_at ON sprites (created_at DESC);
CREATE INDEX idx_sprite_active_created_at ON sprites (created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_sprite_active_created_by ON sprites (created_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_sprite_deleted_at ON sprites (deleted_at) WHERE deleted_at IS NOT NULL;

-- Asset pack
CREATE INDEX idx_asset_pack_name_trgm ON asset_pack USING GIN (name gin_trgm_ops);
CREATE INDEX idx_asset_pack_price ON asset_pack (price);
CREATE INDEX idx_asset_pack_created_at ON asset_pack (created_at DESC);
CREATE INDEX idx_asset_pack_active_created_at ON asset_pack (created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_asset_pack_active_price ON asset_pack (price) WHERE deleted_at IS NULL;
CREATE INDEX idx_asset_pack_deleted_at ON asset_pack (deleted_at) WHERE deleted_at IS NOT NULL;

-- Asset pack sprites (join table)
CREATE INDEX idx_asset_pack_sprites_pack ON asset_pack_sprites (asset_pack_id);
CREATE INDEX idx_asset_pack_sprites_sprite ON asset_pack_sprites (sprite_id);