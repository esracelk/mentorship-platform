package com.sau.mentorship.connection.service;

import com.sau.mentorship.connection.DTO.ConnectionResponseDTO;
import com.sau.mentorship.profile.alumni.entity.AlumniProfile;
import com.sau.mentorship.connection.entity.Connection;
import com.sau.mentorship.profile.student.entity.StudentProfile;
import com.sau.mentorship.connection.enums.ConnectionStatus;
import com.sau.mentorship.common.exception.UserNotFoundException;
import com.sau.mentorship.profile.alumni.repository.AlumniProfileRepository;
import com.sau.mentorship.connection.repository.ConnectionRepository;
import com.sau.mentorship.profile.student.repository.StudentProfileRepository;
import com.sau.mentorship.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public String requestConnection(Long studentId, Long alumniId, String message) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new UserNotFoundException("Student not found"));
        AlumniProfile alumni = alumniProfileRepository.findById(alumniId)
                .orElseThrow(() -> new UserNotFoundException("Alumni not found"));

        if (connectionRepository.existsByStudentIdAndAlumniId(studentId, alumniId)) {
            throw new IllegalStateException("Bu mentora zaten bir bağlantı isteği gönderdiniz!");
        }

        Connection connection = Connection.builder()
                .student(student)
                .alumni(alumni)
                .status(ConnectionStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .message(message)
                .build();

        connectionRepository.save(connection);

        // Mentore in-app bildirim gönder
        String studentName = student.getUser().getFirstName() + " " + student.getUser().getLastName();
        String notifMsg = studentName + " size mentorluk isteği gönderdi."
                + (message != null && !message.isBlank() ? " Mesaj: \"" + message + "\"" : "");
        notificationService.createNotification(alumni.getUser(), notifMsg);

        return "Connection request sent successfully.";
    }

    @Transactional
    public String acceptConnection(Long connectionId, Long authenticatedAlumniId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found"));

        if (!connection.getAlumni().getId().equals(authenticatedAlumniId)) {
            throw new IllegalArgumentException("Bu bağlantı isteğini onaylama yetkiniz yok.");
        }

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new IllegalStateException("Connection is not in PENDING state.");
        }

        AlumniProfile alumni = connection.getAlumni();
        long activeCount = connectionRepository.countByAlumniAndStatus(alumni, ConnectionStatus.ACCEPTED);

        if (activeCount >= 3) {
            throw new IllegalStateException("Mentor cannot have more than 3 active mentees.");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setActedUponAt(LocalDateTime.now());
        connectionRepository.save(connection);

        // Menteee in-app bildirim gönder
        String alumniName = alumni.getUser().getFirstName() + " " + alumni.getUser().getLastName();
        String alumniEmail = alumni.getUser().getEmail();
        notificationService.createNotification(
                connection.getStudent().getUser(),
                alumniName + " mentorluk isteğinizi kabul etti! "
                        + "İlk görüşmenizi gerçekleştirmek için mentorunuzla "
                        + alumniEmail + " e-posta adresi üzerinden iletişime geçebilirsiniz."
        );

        return "Connection accepted. Notification sent.";
    }

    @Transactional
    public String rejectConnection(Long connectionId, Long authenticatedAlumniId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found"));

        if (!connection.getAlumni().getId().equals(authenticatedAlumniId)) {
            throw new IllegalArgumentException("Bu bağlantı isteğini reddetme yetkiniz yok.");
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        connection.setActedUponAt(LocalDateTime.now());
        connectionRepository.save(connection);

        // Menteee ret bildirimi gönder
        String alumniName = connection.getAlumni().getUser().getFirstName() + " "
                + connection.getAlumni().getUser().getLastName();
        notificationService.createNotification(
                connection.getStudent().getUser(),
                alumniName + " mentorluk isteğinizi bu sefer kabul edemedi."
        );

        return "Connection rejected. Notification sent.";
    }

    public List<ConnectionResponseDTO> getConnectionsByStudent(Long studentId) {
        return connectionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ConnectionResponseDTO> getConnectionsByAlumni(Long alumniId) {
        return connectionRepository.findByAlumniId(alumniId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ConnectionResponseDTO> getMenteesByAlumni(Long alumniId) {
        return connectionRepository.findByAlumniId(alumniId).stream()
                .filter(c -> c.getStatus() == ConnectionStatus.ACCEPTED)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ConnectionResponseDTO mapToDTO(Connection connection) {
        return ConnectionResponseDTO.builder()
                .id(connection.getId())
                .studentId(connection.getStudent().getId())
                .studentName(connection.getStudent().getUser().getFirstName() + " "
                        + connection.getStudent().getUser().getLastName())
                .alumniId(connection.getAlumni().getId())
                .alumniName(connection.getAlumni().getUser().getFirstName() + " "
                        + connection.getAlumni().getUser().getLastName())
                .alumniEmail(connection.getAlumni().getUser().getEmail())
                .status(connection.getStatus())
                .message(connection.getMessage())
                .requestedAt(connection.getRequestedAt())
                .build();
    }
}
