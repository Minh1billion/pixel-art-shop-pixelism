package pixelart.shop.features.sprite.repository;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.user.entity.User;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SpriteSpecification {

    public static Specification<Sprite> filter(
            List<UUID> categoryIds,
            String keyword,
            User createdBy
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (createdBy != null) {
                predicates.add(cb.equal(root.get("createdBy"), createdBy));
            }
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categoryIds != null && !categoryIds.isEmpty()) {
                Join<Sprite, Category> categoryJoin = root.join("categories", JoinType.INNER);
                predicates.add(categoryJoin.get("id").in(categoryIds));
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}