package com.sau.mentorship.notification.service;

import com.sau.mentorship.notification.DTO.NotificationDTO;
import com.sau.mentorship.notification.entity.Notification;
import com.sau.mentorship.notification.repository.NotificationRepository;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.user.repository.UserRepository;
import com.sau.mentorship.common.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Belirtilen kullanıcıya in-app bildirim oluşturur.
     */
    @Transactional
    public void createNotification(User recipient, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    /**
     * Kullanıcının tüm bildirimlerini döner (yeniden eskiye).
     */
    public List<NotificationDTO> getNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Kullanıcının okunmamış bildirim sayısını döner.
     */
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    /**
     * Kullanıcının tüm bildirimlerini okundu olarak işaretler.
     */
    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        notificationRepository.markAllAsReadByRecipient(user);
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .message(n.getMessage())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
