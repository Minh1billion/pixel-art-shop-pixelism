package pixelart.shop.features.sprite.dto;

import pixelart.shop.features.sprite.entity.Sprite;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record SpriteListResponse(
        UUID id,
        String name,
        String slug,
        BigDecimal price,
        String imageUrl,
        LocalDateTime createdAt
) {
    public static SpriteListResponse from(Sprite s) {
        return new SpriteListResponse(
                s.getId(),
                s.getName(),
                s.getSlug(),
                s.getPrice(),
                s.getImageUrl(),
                s.getCreatedAt()
        );
    }
}
