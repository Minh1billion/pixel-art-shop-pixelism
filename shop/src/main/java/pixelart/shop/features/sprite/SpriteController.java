package pixelart.shop.features.sprite;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.shared.response.ApiResponse;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sprites")
@RequiredArgsConstructor
public class SpriteController {

    private final SpriteService spriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SpriteResponse>>> getAll(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Page<SpriteResponse> result =
                spriteService.getAll(categoryId, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(result)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SpriteResponse>> getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        spriteService.getById(id)
                )
        );
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<SpriteResponse>> create(
            @RequestPart("data") SpriteRequest request,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User currentUser
    ) throws IOException {

        SpriteResponse response =
                spriteService.create(request, image, currentUser);

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<SpriteResponse>> update(
            @PathVariable UUID id,
            @RequestPart("data") SpriteRequest request,
            @RequestPart(value = "image", required = false)
            MultipartFile image
    ) throws IOException {

        SpriteResponse response =
                spriteService.update(id, request, image);

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id
    ) throws IOException {

        spriteService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(null)
        );
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<SpriteResponse>> restore(
            @PathVariable UUID id
    ) {

        SpriteResponse response = spriteService.restore(id);

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentDelete(
            @PathVariable UUID id
    ) throws IOException {

        spriteService.hardDelete(id);

        return ResponseEntity.ok(
                ApiResponse.success(null)
        );
    }
}