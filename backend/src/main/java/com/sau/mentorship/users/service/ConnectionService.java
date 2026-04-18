package com.sau.mentorship.users.service;

import com.sau.mentorship.users.DTO.response.ConnectionResponseDTO;
import com.sau.mentorship.users.entity.AlumniProfile;
import com.sau.mentorship.users.entity.Connection;
import com.sau.mentorship.users.entity.StudentProfile;
import com.sau.mentorship.users.enums.ConnectionStatus;
import com.sau.mentorship.users.exception.UserNotFoundException;
import com.sau.mentorship.users.repository.AlumniProfileRepository;
import com.sau.mentorship.users.repository.ConnectionRepository;
import com.sau.mentorship.users.repository.StudentProfileRepository;
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
    public String acceptConnection(Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found"));

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
    public String rejectConnection(Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found"));

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
