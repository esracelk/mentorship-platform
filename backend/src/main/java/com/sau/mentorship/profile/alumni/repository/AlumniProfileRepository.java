package com.sau.mentorship.profile.alumni.repository;

import com.sau.mentorship.profile.alumni.entity.AlumniProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {
    Optional<AlumniProfile> findById(Long id);
}
