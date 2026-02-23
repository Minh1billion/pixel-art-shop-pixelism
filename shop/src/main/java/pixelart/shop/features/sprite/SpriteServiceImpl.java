package pixelart.shop.features.sprite;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pixelart.shop.features.category.entity.Category;
import pixelart.shop.features.category.repository.CategoryRepository;
import pixelart.shop.features.sprite.dto.SpriteFilterRequest;
import pixelart.shop.features.sprite.dto.SpriteListResponse;
import pixelart.shop.features.sprite.dto.SpriteRequest;
import pixelart.shop.features.sprite.dto.SpriteResponse;
import pixelart.shop.features.sprite.entity.Sprite;
import pixelart.shop.features.sprite.repository.SpriteRepository;
import pixelart.shop.features.sprite.repository.SpriteSpecification;
import pixelart.shop.features.user.entity.User;
import pixelart.shop.features.user.repository.UserRepository;
import pixelart.shop.shared.exception.AppException;
import pixelart.shop.shared.infrastructure.storage.FileStorage;
import pixelart.shop.shared.infrastructure.storage.UploadResult;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SpriteServiceImpl implements SpriteService {

    private final UserRepository userRepository;
    private final SpriteRepository spriteRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorage fileStorage;

    @Override
    @Transactional(readOnly = true)
    public Page<SpriteListResponse> getAll(SpriteFilterRequest filter, int page, int size) {
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Sprite> spec = SpriteSpecification.filter(filter.categoryIds(), filter.keyword(), null);
        return spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpriteListResponse> getByUser(SpriteFilterRequest filter, int page, int size, User currentUser) {
        Pageable pageable = buildPageable(filter, page, size);
        Specification<Sprite> spec = SpriteSpecification.filter(filter.categoryIds(), filter.keyword(), currentUser);
        return spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpriteListResponse> getByUserId(SpriteFilterRequest filter, int page, int size, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User does not exist"));

        Pageable pageable = buildPageable(filter, page, size);
        Specification<Sprite> spec = SpriteSpecification.filter(filter.categoryIds(), filter.keyword(), user);
        return spriteRepository.findAll(spec, pageable).map(SpriteListResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public SpriteResponse getById(UUID id) {
        return spriteRepository
                .findWithDetailsById(id)
                .filter(Sprite::isActive)
                .map(SpriteResponse::from)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));
    }

    @Override
    public SpriteResponse create(SpriteRequest request, MultipartFile image, User currentUser) throws IOException {
        List<Category> categories = categoryRepository.findAllById(request.categoryIds());

        if (categories.isEmpty()) {
            throw AppException.badRequest("At least one category is required");
        }

        UploadResult uploadResult = uploadImage(image);

        Sprite sprite = Sprite.builder()
                .name(request.name())
                .slug(generateUniqueSlug(request.name()))
                .imageUrl(uploadResult.url())
                .cloudinaryId(uploadResult.publicId())
                .categories(categories)
                .createdBy(currentUser)
                .build();

        return SpriteResponse.from(spriteRepository.save(sprite));
    }

    @Override
    public SpriteResponse update(UUID id, SpriteRequest request, MultipartFile image) throws IOException {
        // Dùng findWithDetailsById để tránh lazy load createdBy sau này
        Sprite sprite = spriteRepository
                .findWithDetailsById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        List<Category> categories = categoryRepository.findAllById(request.categoryIds());

        if (categories.isEmpty()) {
            throw AppException.badRequest("At least one category is required");
        }

        if (image != null && !image.isEmpty()) {
            if (sprite.getCloudinaryId() != null) {
                deleteImage(sprite.getCloudinaryId());
            }

            UploadResult uploadResult = uploadImage(image);
            sprite.setImageUrl(uploadResult.url());
            sprite.setCloudinaryId(uploadResult.publicId());
        }

        sprite.setName(request.name());
        sprite.setCategories(categories);

        return SpriteResponse.from(spriteRepository.save(sprite));
    }

    @Override
    public void delete(UUID id) throws IOException {
        Sprite sprite = spriteRepository
                .findById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        sprite.setActive(false);
        spriteRepository.save(sprite);
    }

    @Override
    public void hardDelete(UUID id) throws IOException {
        Sprite sprite = spriteRepository
                .findById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        if (sprite.getCloudinaryId() != null) {
            deleteImage(sprite.getCloudinaryId());
        }

        spriteRepository.delete(sprite);
    }

    @Override
    public SpriteResponse restore(UUID id) {
        Sprite sprite = spriteRepository
                .findWithDetailsById(id)
                .orElseThrow(() -> AppException.notFound("Sprite does not exist"));

        if (sprite.isActive()) {
            throw AppException.badRequest("Sprite is not deleted");
        }

        sprite.setActive(true);

        return SpriteResponse.from(spriteRepository.save(sprite));
    }

    private UploadResult uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw AppException.badRequest("Image is required");
        }
        return fileStorage.upload(file.getBytes(), "sprites");
    }

    private void deleteImage(String publicId) {
        try {
            fileStorage.delete(publicId);
        } catch (IOException e) {
            log.warn("Unable to delete image ({}): {}", publicId, e.getMessage());
        }
    }

    private Pageable buildPageable(SpriteFilterRequest filter, int page, int size) {
        Sort sort = Sort.unsorted();
        if (filter.sortBy() != null && !filter.sortBy().isBlank()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(filter.sortOrder())
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, filter.sortBy());
        }
        return PageRequest.of(page, size, sort);
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");

        String slug = baseSlug;
        int counter = 1;

        while (spriteRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }
}