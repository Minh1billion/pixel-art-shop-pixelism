package pixelart.shop.shared.infrastructure.email.template;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EmailTemplateEngine {

    public String buildContent(EmailTemplate template, Map<String, Object> data) {
        return switch (template) {
            case OTP_REGISTRATION            -> buildOtpRegistration(data);
            case OTP_RESET_PASSWORD          -> buildOtpResetPassword(data);
            case WELCOME                     -> buildWelcome(data);
            case ORDER_CONFIRMATION          -> buildOrderConfirmation(data);
            case ORDER_COMPLETED             -> buildOrderCompleted(data);
            case ADMIN_NEW_USER_NOTIFICATION -> buildAdminNewUser(data);
        };
    }

    private String buildOtpRegistration(Map<String, Object> data) {
        String otp = (String) data.get("otp");
        return """
                Hello!

                You have requested to register an account at Pixel Art Shop.

                🔐 Your OTP code is: %s

                ⏰ This code is valid for 5 minutes.
                ⚠️ Please do not share this code with anyone.

                If you did not make this request, please ignore this email.

                Best regards,
                Pixel Art Shop Team 🎮
                """.formatted(otp);
    }

    private String buildOtpResetPassword(Map<String, Object> data) {
        String otp = (String) data.get("otp");
        return """
                Hello!

                You have requested to reset your password at Pixel Art Shop.

                🔑 Your OTP verification code is: %s

                ⏰ This code is valid for 5 minutes.
                ⚠️ If you did not request a password reset, your account may be at risk.
                     Please change your password immediately or contact support.

                Best regards,
                Pixel Art Shop Team 🎮
                """.formatted(otp);
    }

    private String buildWelcome(Map<String, Object> data) {
        String username = (String) data.get("username");
        return """
                Hello %s! 🎉

                Welcome to Pixel Art Shop — the home of beautiful pixel art sprites!

                Your account has been successfully created.

                You can now start exploring:
                  🎮 Browse sprite collections
                  🛒 Purchase and download your favorite sprites
                  ⭐ Leave ratings and reviews

                If you need any assistance, feel free to contact us anytime.

                Have fun!
                Pixel Art Shop Team 🎮
                """.formatted(username);
    }

    private String buildOrderConfirmation(Map<String, Object> data) {
        String orderId  = (String) data.get("orderId");
        String username = (String) data.get("username");
        return """
                Hello %s!

                ✅ Your order #%s has been successfully confirmed.

                Thank you for shopping at Pixel Art Shop.
                You can download your sprites in the "My Orders" section.

                Best regards,
                Pixel Art Shop Team 🎮
                """.formatted(username, orderId);
    }

    private String buildOrderCompleted(Map<String, Object> data) {
        String orderId  = (String) data.get("orderId");
        String username = (String) data.get("username");
        return """
                Hello %s!

                📦 Your order #%s has been completed.

                Thank you for trusting Pixel Art Shop.
                Please consider leaving a review to support the community!

                Best regards,
                Pixel Art Shop Team 🎮
                """.formatted(username, orderId);
    }

    private String buildAdminNewUser(Map<String, Object> data) {
        String email    = (String) data.getOrDefault("email", "N/A");
        String username = (String) data.getOrDefault("username", "N/A");
        String provider = (String) data.getOrDefault("provider", "LOCAL");
        return """
                [System Notification]

                👤 A new user has just registered:

                Email:    %s
                Username: %s
                Provider: %s

                Pixel Art Shop System
                """.formatted(email, username, provider);
    }
}
