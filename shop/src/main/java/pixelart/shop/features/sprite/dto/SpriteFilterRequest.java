package pixelart.shop.features.sprite.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SpriteFilterRequest(

        List<UUID> categoryIds,
//        BigDecimal minPrice,
//        BigDecimal maxPrice,
        String keyword,
        String sortBy,
        String sortOrder
) {
    public SpriteFilterRequest {
        if (categoryIds == null) categoryIds = List.of();
    }
}