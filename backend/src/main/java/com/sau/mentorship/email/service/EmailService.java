package com.sau.mentorship.email.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendConnectionAcceptedEmail(String studentEmail, String alumniName) {
        log.info("====================================");
        log.info("Mock Email Sent to: {}", studentEmail);
        log.info("Subject: Mentorship Request Accepted");
        log.info("Body: Your mentorship request to {} has been accepted! You can now contact your mentor.", alumniName);
        log.info("====================================");
    }
}
