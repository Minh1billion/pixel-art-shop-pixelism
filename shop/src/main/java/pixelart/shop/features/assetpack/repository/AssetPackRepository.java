package pixelart.shop.features.assetpack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import pixelart.shop.features.assetpack.entity.AssetPack;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetPackRepository extends JpaRepository<AssetPack, UUID>, JpaSpecificationExecutor<AssetPack> {

    Optional<AssetPack> findByIdAndIsActiveTrue(UUID id);
}