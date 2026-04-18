package com.sau.mentorship.users.repository;

import com.sau.mentorship.users.entity.AlumniProfile;
import com.sau.mentorship.users.entity.Connection;
import com.sau.mentorship.users.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    long countByAlumniAndStatus(AlumniProfile alumni, ConnectionStatus status);

    List<Connection> findByAlumniId(Long alumniId);

    List<Connection> findByStudentId(Long studentId);
}
