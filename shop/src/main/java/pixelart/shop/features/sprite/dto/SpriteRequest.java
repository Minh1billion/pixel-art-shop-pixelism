package pixelart.shop.features.sprite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SpriteRequest(

        @NotBlank(message = "Sprite name can't be blank")
        String name,

        @NotNull(message = "Category can't be null")
        List<UUID> categoryIds
) {}
