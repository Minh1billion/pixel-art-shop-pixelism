package pixelart.shop.features.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.category.entity.Category;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    boolean existsByName(String name);
    Optional<Category> findBySlug(String slug);
}