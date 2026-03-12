package com.sau.mentorship.users.repository;

import com.sau.mentorship.users.entity.AlumniProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {
    Optional<AlumniProfile> findById(Long id);
}
