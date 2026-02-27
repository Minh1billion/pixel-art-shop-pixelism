package pixelart.shop.features.assetpack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.assetpack.entity.AssetPack;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetPackRepository extends JpaRepository<AssetPack, UUID>, JpaSpecificationExecutor<AssetPack> {

    @Query("SELECT a FROM AssetPack a WHERE a.id = :id AND a.deletedAt IS NULL")
    Optional<AssetPack> findByIdAndActive(UUID id);
}