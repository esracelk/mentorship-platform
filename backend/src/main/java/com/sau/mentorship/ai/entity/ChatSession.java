package com.sau.mentorship.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {

    @Id
    private String id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "title", nullable = false)
    private String title;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_hidden", nullable = false, columnDefinition = "boolean default false")
    private boolean isHidden = false;
}
