package com.sau.mentorship.profile.student.repository;

import com.sau.mentorship.profile.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findById(Long id);
}
