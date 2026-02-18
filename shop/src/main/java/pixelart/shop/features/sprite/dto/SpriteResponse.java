package pixelart.shop.features.sprite.dto;

import pixelart.shop.features.sprite.entity.Sprite;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SpriteResponse(
        UUID id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        UUID categoryId,
        String categoryName,
        String createdBy,
        List<String> tags,
        LocalDateTime createdAt
) {

    public static SpriteResponse from(Sprite s) {
        return new SpriteResponse(
                s.getId(),
                s.getName(),
                s.getSlug(),
                s.getDescription(),
                s.getPrice(),
                s.getImageUrl(),
                s.getCategory().getId(),
                s.getCategory().getName(),
                s.getCreatedBy().getNickname(),
                s.getTags(),
                s.getCreatedAt()
        );
    }
}
