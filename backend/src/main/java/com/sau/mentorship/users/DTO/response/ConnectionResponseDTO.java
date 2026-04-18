package com.sau.mentorship.users.DTO.response;

import com.sau.mentorship.users.enums.ConnectionStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ConnectionResponseDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long alumniId;
    private String alumniName;
    private ConnectionStatus status;
    private String message;
    private LocalDateTime requestedAt;
}
