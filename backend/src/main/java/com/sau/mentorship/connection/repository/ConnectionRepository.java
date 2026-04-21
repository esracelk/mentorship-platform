package com.sau.mentorship.connection.repository;

import com.sau.mentorship.profile.alumni.entity.AlumniProfile;
import com.sau.mentorship.connection.entity.Connection;
import com.sau.mentorship.connection.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    long countByAlumniAndStatus(AlumniProfile alumni, ConnectionStatus status);

    List<Connection> findByAlumniId(Long alumniId);

    List<Connection> findByStudentId(Long studentId);
}
