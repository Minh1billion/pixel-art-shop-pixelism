package pixelart.shop.shared.infrastructure.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pixelart.shop.shared.infrastructure.email.template.EmailRequest;
import pixelart.shop.shared.infrastructure.email.template.EmailTemplateEngine;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSender {

    private final JavaMailSender mailSender;
    private final EmailTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void send(EmailRequest request) {
        try {
            String subject = request.getTemplate().formatSubject(request.getSubjectArgs());
            String content = templateEngine.buildContent(request.getTemplate(), request.getData());

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(request.getTo());
            message.setSubject(subject);
            message.setText(content);

            mailSender.send(message);
            log.info("Email [{}] sent {} successfully", request.getTemplate(), request.getTo());

        } catch (Exception e) {
            log.error("Error sending email [{}] to {}: {}",
                    request.getTemplate(), request.getTo(), e.getMessage());
        }
    }
}