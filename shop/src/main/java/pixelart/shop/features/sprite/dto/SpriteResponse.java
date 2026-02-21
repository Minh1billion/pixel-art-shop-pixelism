package pixelart.shop.features.sprite.dto;

import pixelart.shop.features.category.entity.Category;
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
        List<UUID> categoryIds,
        List<String> categoryNames,
        String createdBy,
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
                s.getCategories().stream()
                        .map(Category::getId).toList(),
                s.getCategories().stream()
                        .map(Category::getName).toList(),
                s.getCreatedBy().getNickname(),
                s.getCreatedAt()
        );
    }
}
