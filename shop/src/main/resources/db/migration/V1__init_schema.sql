-- V1__init_schema.sql
-- Khởi tạo database schema cho Pixel Art Shop
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Bảng users
CREATE TABLE users (
                       id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email       VARCHAR(255) UNIQUE NOT NULL,
                       username    VARCHAR(100) UNIQUE NOT NULL,
                       password    VARCHAR(255),
                       full_name   VARCHAR(255),
                       avatar_url  VARCHAR(500),
                       role        VARCHAR(20) NOT NULL DEFAULT 'USER'
                           CHECK (role IN ('USER', 'ADMIN')),
                       provider    VARCHAR(20) NOT NULL DEFAULT 'LOCAL'
                           CHECK (provider IN ('LOCAL', 'GOOGLE', 'GITHUB')),
                       provider_id VARCHAR(255),
                       is_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       is_active   BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                       updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bảng refresh_tokens
CREATE TABLE refresh_tokens (
                                id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                token       VARCHAR(1000) UNIQUE NOT NULL,
                                user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                expires_at  TIMESTAMP NOT NULL,
                                is_revoked  BOOLEAN NOT NULL DEFAULT FALSE,
                                created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bảng categories
CREATE TABLE categories (
                            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name        VARCHAR(100) UNIQUE NOT NULL,
                            slug        VARCHAR(100) UNIQUE NOT NULL,
                            description TEXT,
                            created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                            updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bảng sprites
CREATE TABLE sprites (
                         id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         name            VARCHAR(255) NOT NULL,
                         slug            VARCHAR(255) UNIQUE NOT NULL,
                         description     TEXT,
                         price           DECIMAL(10,2) NOT NULL DEFAULT 0,
                         image_url       VARCHAR(500) NOT NULL,
                         cloudinary_id   VARCHAR(255) NOT NULL,
                         category_id     UUID NOT NULL REFERENCES categories(id),
                         created_by      UUID NOT NULL REFERENCES users(id),
                         is_active       BOOLEAN NOT NULL DEFAULT TRUE,
                         created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
                         updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bảng sprite_tags (collection table cho List<String> tags)
CREATE TABLE sprite_tags (
                             sprite_id UUID NOT NULL REFERENCES sprites(id) ON DELETE CASCADE,
                             tag VARCHAR(50) NOT NULL,
                             PRIMARY KEY (sprite_id, tag)
);

-- Indexes để tăng tốc query
CREATE INDEX idx_users_email       ON users(email);
CREATE INDEX idx_users_provider    ON users(provider, provider_id);
CREATE INDEX idx_tokens_token      ON refresh_tokens(token);
CREATE INDEX idx_tokens_user       ON refresh_tokens(user_id);
CREATE INDEX idx_sprites_category  ON sprites(category_id);
CREATE INDEX idx_sprites_active    ON sprites(is_active);
CREATE INDEX idx_sprite_tags       ON sprite_tags(sprite_id);

-- Trigger tự cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Seed: Tạo tài khoản admin mặc định
-- Password: Admin@123456 (BCrypt encoded)
INSERT INTO users (email, username, password, full_name, role, provider, is_verified)
VALUES (
           'admin@pixelart.com',
           'admin',
           '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewB5bO3DEqnK1KLG',
           'Administrator',
           'ADMIN',
           'LOCAL',
           TRUE
       );

-- Seed: Tạo một số categories mẫu
INSERT INTO categories (name, slug, description) VALUES
                                                     ('Characters', 'characters', 'Nhân vật pixel art 2D'),
                                                     ('Environments', 'environments', 'Nền và môi trường pixel art'),
                                                     ('Items & Icons', 'items-icons', 'Vật phẩm, biểu tượng và UI elements'),
                                                     ('Enemies', 'enemies', 'Kẻ thù và monster sprites'),
                                                     ('Effects', 'effects', 'Hiệu ứng animation pixel art');