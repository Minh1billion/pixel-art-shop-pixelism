package pixelart.shop.features.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import pixelart.shop.features.auth.AuthService;
import pixelart.shop.features.auth.dto.AuthResponse;
import pixelart.shop.shared.util.CookieUtil;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;

    @Value("${shop.frontend.redirect-uri}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        CustomUserPrincipal principal =
                (CustomUserPrincipal) authentication.getPrincipal();

        log.info("OAuth2 authentication successful for user: {}",
                principal.getUser().getEmail());

        AuthResponse authResponse =
                authService.buildAuthResponse(principal.getUser());

        CookieUtil.addAuthCookies(
                response,
                authResponse.getAccessToken(),
                authResponse.getRefreshToken()
        );

        String targetUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/home")
                .build()
                .toUriString();


        getRedirectStrategy().sendRedirect(
                request,
                response,
                targetUrl
        );
    }

}