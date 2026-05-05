package com.sau.mentorship.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDTO {
    private String question;
    private String chatId; // now acts as sessionId
    private String userEmail;
}
