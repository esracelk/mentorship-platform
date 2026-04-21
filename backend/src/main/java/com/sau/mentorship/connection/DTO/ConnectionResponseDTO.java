package com.sau.mentorship.connection.DTO;

import com.sau.mentorship.connection.enums.ConnectionStatus;
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
