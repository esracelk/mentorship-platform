package com.sau.mentorship.email.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    /**
     * Mentee bir istek gönderdiğinde mentore bildirim e-postası gönderir.
     */
    public void sendConnectionRequestEmail(String alumniEmail, String studentName, String message) {
        log.info("====================================");
        log.info("Mock Email Sent to MENTOR: {}", alumniEmail);
        log.info("Subject: Yeni Mentorluk İsteği - {}", studentName);
        log.info("Body: {} adlı öğrenci size mentorluk isteği gönderdi.", studentName);
        if (message != null && !message.isBlank()) {
            log.info("Mesaj: {}", message);
        }
        log.info("====================================");
    }

    /**
     * Mentor isteği kabul ettiğinde menteee e-posta gönderir (mentorun emaili dahil).
     */
    public void sendConnectionAcceptedEmail(String studentEmail, String alumniName, String alumniEmail) {
        log.info("====================================");
        log.info("Mock Email Sent to MENTEE: {}", studentEmail);
        log.info("Subject: Mentorluk İsteğiniz Kabul Edildi!");
        log.info("Body: {} adlı mentorunuz isteğinizi kabul etti. İlk görüşmenizi gerçekleştirmek için mentorunuzla {} e-posta adresi üzerinden iletişime geçebilirsiniz.", alumniName, alumniEmail);
        log.info("====================================");
    }
}
