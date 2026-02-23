package pixelart.shop.features.user;

import org.springframework.data.domain.Page;
import pixelart.shop.features.user.dto.UserDto;

public interface UserService {
    Page<UserDto> getAll(String keyword, int page, int size);
}