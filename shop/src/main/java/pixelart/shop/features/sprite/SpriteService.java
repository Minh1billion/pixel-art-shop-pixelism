package pixelart.shop.features.sprite;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.sprite.dto.SpriteFilterRequest;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.user.entity.User;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface SpriteService {

    public Page<SpriteResponse> getAll(
            SpriteFilterRequest filter,
            int page,
            int size
    );

    SpriteResponse getById(UUID id);

    SpriteResponse create(
            SpriteRequest request,
            MultipartFile image,
            User currentUser
    ) throws IOException;

    SpriteResponse update(
            UUID id,
            SpriteRequest request,
            MultipartFile image
    ) throws IOException;

    void delete(UUID id) throws IOException;

    void hardDelete(UUID id) throws IOException;

    SpriteResponse restore(UUID id);
}
