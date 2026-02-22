package pixelart.shop.features.sprite.repository;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.sprite.entity.Sprite;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class SpriteSpecification {

    public static Specification<Sprite> filter(
            List<UUID> categoryIds,
//            BigDecimal minPrice,
//            BigDecimal maxPrice,
            String keyword
    ) {
        return (root, query, cb) -> {

            Predicate predicate = cb.conjunction();

            predicate = cb.and(predicate, cb.isTrue(root.get("isActive")));
            
            if (categoryIds != null && !categoryIds.isEmpty()) {
                Subquery<Category> subquery = query.subquery(Category.class);
                Root<Sprite> subRoot = subquery.correlate(root);
                Join<Sprite, Category> catJoin = subRoot.join("categories");

                subquery.select(catJoin)
                        .where(catJoin.get("id").in(categoryIds));

                predicate = cb.and(predicate, cb.exists(subquery));
            }

//            if (minPrice != null) {
//                predicate = cb.and(
//                        predicate,
//                        cb.greaterThanOrEqualTo(root.get("price"), minPrice)
//                );
//            }
//
//            if (maxPrice != null) {
//                predicate = cb.and(
//                        predicate,
//                        cb.lessThanOrEqualTo(root.get("price"), maxPrice)
//                );
//            }

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                predicate = cb.and(
                        predicate,
                        cb.or(
                                cb.like(cb.lower(root.get("name")), pattern),
                                cb.like(cb.lower(root.get("description")), pattern)
                        )
                );
            }

            return predicate;
        };
    }
}