package com.sau.mentorship.profile.student.service;

import com.sau.mentorship.profile.student.DTO.UpdateStudentProfileRequestDTO;
import com.sau.mentorship.profile.student.DTO.response.StudentDetailResponseDTO;
import com.sau.mentorship.connection.entity.Connection;
import com.sau.mentorship.user.entity.Skill;
import com.sau.mentorship.profile.student.entity.StudentProfile;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.common.exception.UserNotFoundException;
import com.sau.mentorship.user.repository.SkillRepository;
import com.sau.mentorship.profile.student.repository.StudentProfileRepository;
import com.sau.mentorship.user.repository.UserRepository;
import com.sau.mentorship.connection.repository.ConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;
    private final ConnectionRepository connectionRepository;

    @Transactional
    public void updateProfile(String email, UpdateStudentProfileRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            user.setLastName(request.getLastName());
        if (request.getAboutMe() != null)
            user.setAboutMe(request.getAboutMe());

        if (request.getSkills() != null) {
            Set<Skill> newSkills = new HashSet<>();
            for (String skillName : request.getSkills()) {
                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
                newSkills.add(skill);
            }
            user.setSkills(newSkills);
        }

        userRepository.save(user);

        StudentProfile studentProfile = studentProfileRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("Student profile not found"));

        if (request.getBirthday() != null)
            studentProfile.setBirthday(request.getBirthday());
        if (request.getEmploymentStatus() != null)
            studentProfile.setEmploymentStatus(request.getEmploymentStatus());
        if (request.getExperience() != null)
            studentProfile.setExperience(request.getExperience());
        if (request.getDepartment() != null)
            studentProfile.setDepartment(request.getDepartment());
        if (request.getGrade() != null)
            studentProfile.setGrade(request.getGrade());
        if (request.getLinkedinUrl() != null)
            studentProfile.setLinkedinUrl(request.getLinkedinUrl());

        studentProfileRepository.save(studentProfile);
    }

    public StudentDetailResponseDTO getStudentDetailForAlumni(Long studentId, Long alumniId) {
        List<Connection> connections = connectionRepository.findByStudentId(studentId);
        boolean hasRequested = connections.stream()
                .anyMatch(c -> c.getAlumni().getId().equals(alumniId));

        if (!hasRequested) {
            throw new IllegalArgumentException("Sadece size istek atan öğrencilerin profillerini görebilirsiniz!");
        }

        StudentProfile studentProfile = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new UserNotFoundException("Student not found"));

        return StudentDetailResponseDTO.builder()
                .firstName(studentProfile.getUser().getFirstName())
                .lastName(studentProfile.getUser().getLastName())
                .email(studentProfile.getUser().getEmail())
                .aboutMe(studentProfile.getUser().getAboutMe())
                .department(studentProfile.getDepartment())
                .grade(studentProfile.getGrade())
                .experience(studentProfile.getExperience())
                .linkedinUrl(studentProfile.getLinkedinUrl())
                .build();
    }
}
