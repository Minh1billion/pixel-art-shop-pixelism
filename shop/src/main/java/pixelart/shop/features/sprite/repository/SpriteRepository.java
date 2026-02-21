package pixelart.shop.features.sprite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.sprite.entity.Sprite;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpriteRepository extends JpaRepository<Sprite, UUID>, JpaSpecificationExecutor<Sprite> {

    Optional<Sprite> findByIdAndIsActiveTrue(UUID id);

    boolean existsBySlug(String slug);

    @Query("SELECT s FROM Sprite s WHERE s.isActive = false AND s.updatedAt < :cutoffDate")
    List<Sprite> findInactiveBefore(LocalDateTime cutoffDate);
}