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
import com.sau.mentorship.email.service.EmailService;
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
    private final EmailService emailService;

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

        // Send Email via underlying service
        String studentEmail = connection.getStudent().getUser().getEmail();
        String alumniName = alumni.getUser().getFirstName() + " " + alumni.getUser().getLastName();
        emailService.sendConnectionAcceptedEmail(studentEmail, alumniName);

        return "Connection accepted. Email notification sent.";
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

        return "Connection rejected.";
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

    private ConnectionResponseDTO mapToDTO(Connection connection) {
        return ConnectionResponseDTO.builder()
                .id(connection.getId())
                .studentId(connection.getStudent().getId())
                .studentName(connection.getStudent().getUser().getFirstName() + " "
                        + connection.getStudent().getUser().getLastName())
                .alumniId(connection.getAlumni().getId())
                .alumniName(connection.getAlumni().getUser().getFirstName() + " "
                        + connection.getAlumni().getUser().getLastName())
                .status(connection.getStatus())
                .message(connection.getMessage())
                .requestedAt(connection.getRequestedAt())
                .build();
    }
}
