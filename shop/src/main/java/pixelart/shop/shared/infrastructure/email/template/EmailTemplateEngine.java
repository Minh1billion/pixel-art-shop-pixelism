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

        String body = EmailLayout.h1("Verify Your Identity") +
                EmailLayout.subtitle("✦ Registration Cipher ✦") +
                EmailLayout.p("An adventurer seeks to join the realm. Use the cipher below to complete your registration.") +
                EmailLayout.otpBox(otp) +
                EmailLayout.warningBox("Do not share this cipher with anyone. Pixelism will never ask for it.") +
                EmailLayout.p("If you did not make this request, you may safely ignore this message.");

        return EmailLayout.wrap("Verify Your Account — Pixelism", body);
    }

    private String buildOtpResetPassword(Map<String, Object> data) {
        String otp = (String) data.get("otp");

        String body = EmailLayout.h1("Reforge Your Oath") +
                EmailLayout.subtitle("✦ Password Reset Cipher ✦") +
                EmailLayout.p("A request to reforge the binding oath for your account has been received.") +
                EmailLayout.otpBox(otp) +
                EmailLayout.warningBox("If you did not request this, your account may be at risk. Change your password immediately or contact support.") +
                EmailLayout.p("This cipher expires in 5 minutes. Do not share it with anyone.");

        return EmailLayout.wrap("Reset Your Password — Pixelism", body);
    }

    private String buildWelcome(Map<String, Object> data) {
        String username = (String) data.get("username");

        String featureRows =
                "<table cellpadding=\"0\" cellspacing=\"0\" style=\"margin:20px 0;\">" +
                        EmailLayout.badge("⚔", "Browse curated sprite collections across the realm") +
                        EmailLayout.badge("💎", "Purchase and claim your favourite pixel relics") +
                        EmailLayout.badge("✦", "Leave inscriptions and support fellow artisans") +
                        "</table>";

        String body = EmailLayout.h1("Welcome, " + username + "!") +
                EmailLayout.subtitle("✦ Your Legend Begins ✦") +
                EmailLayout.p("Your account has been forged and bound to the realm of Pixelism. The gates are open.") +
                EmailLayout.divider() +
                "<p style=\"margin:0 0 12px;font-size:12px;color:#525252;text-transform:uppercase;letter-spacing:2px;\">What awaits you</p>" +
                featureRows +
                EmailLayout.divider() +
                EmailLayout.p("Should you need guidance, the scribes are always available. May your pixels be sharp and your sprites legendary.");

        return EmailLayout.wrap("Welcome to the Realm — Pixelism", body);
    }

    private String buildOrderConfirmation(Map<String, Object> data) {
        String orderId  = (String) data.get("orderId");
        String username = (String) data.get("username");

        String orderRows =
                "<table width=\"100%%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:20px 0;\">" +
                        EmailLayout.infoRow("Adventurer", username) +
                        EmailLayout.infoRow("Order ID", "#" + orderId) +
                        EmailLayout.infoRow("Status", "✅ Confirmed") +
                        "</table>";

        String body = EmailLayout.h1("Order Confirmed") +
                EmailLayout.subtitle("✦ Relics Secured ✦") +
                EmailLayout.p("Your relics have been claimed and are ready for download. The realm acknowledges your acquisition.") +
                orderRows +
                EmailLayout.p("Head to <strong style=\"color:#ffffff;\">My Orders</strong> in the Sanctum to download your sprites.");

        return EmailLayout.wrap("Order Confirmed — Pixelism", body);
    }

    private String buildOrderCompleted(Map<String, Object> data) {
        String orderId  = (String) data.get("orderId");
        String username = (String) data.get("username");

        String orderRows =
                "<table width=\"100%%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:20px 0;\">" +
                        EmailLayout.infoRow("Adventurer", username) +
                        EmailLayout.infoRow("Order ID", "#" + orderId) +
                        EmailLayout.infoRow("Status", "📦 Completed") +
                        "</table>";

        String body = EmailLayout.h1("Quest Complete") +
                EmailLayout.subtitle("✦ The Relics Are Yours ✦") +
                EmailLayout.p("Your order has been fulfilled. The pixel relics now belong to your collection, adventurer.") +
                orderRows +
                EmailLayout.divider() +
                EmailLayout.p("Consider leaving an inscription to support the artisans of the realm. Every review strengthens the community.");

        return EmailLayout.wrap("Order Completed — Pixelism", body);
    }

    private String buildAdminNewUser(Map<String, Object> data) {
        String email    = (String) data.getOrDefault("email",    "N/A");
        String username = (String) data.getOrDefault("username", "N/A");
        String provider = (String) data.getOrDefault("provider", "LOCAL");

        String rows =
                "<table width=\"100%%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:20px 0;\">" +
                        EmailLayout.infoRow("Email",    email)    +
                        EmailLayout.infoRow("Username", username) +
                        EmailLayout.infoRow("Provider", provider) +
                        "</table>";

        String body = EmailLayout.h1("New Adventurer Joined") +
                EmailLayout.subtitle("✦ System Notification ✦") +
                EmailLayout.p("A new soul has crossed the threshold and joined the realm.") +
                rows;

        return EmailLayout.wrap("[Admin] New User — Pixelism", body);
    }
}