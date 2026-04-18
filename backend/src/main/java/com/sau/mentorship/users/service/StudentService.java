package com.sau.mentorship.users.service;

import com.sau.mentorship.users.DTO.request.UpdateStudentProfileRequestDTO;
import com.sau.mentorship.users.entity.Skill;
import com.sau.mentorship.users.entity.StudentProfile;
import com.sau.mentorship.users.entity.User;
import com.sau.mentorship.users.exception.UserNotFoundException;
import com.sau.mentorship.users.repository.SkillRepository;
import com.sau.mentorship.users.repository.StudentProfileRepository;
import com.sau.mentorship.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;

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
}
