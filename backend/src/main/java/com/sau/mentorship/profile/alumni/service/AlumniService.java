package com.sau.mentorship.profile.alumni.service;

import com.sau.mentorship.profile.alumni.DTO.request.UpdateAlumniProfileRequestDTO;
import com.sau.mentorship.profile.alumni.DTO.response.AlumniDetailResponseDTO;
import com.sau.mentorship.profile.alumni.DTO.response.AlumniListResponseDTO;
import com.sau.mentorship.profile.alumni.entity.AlumniProfile;
import com.sau.mentorship.profile.alumni.mapper.AlumniMapper;
import com.sau.mentorship.user.entity.Skill;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.users2.exception.UserNotFoundException;
import com.sau.mentorship.profile.alumni.repository.AlumniProfileRepository;
import com.sau.mentorship.user.repository.SkillRepository;
import com.sau.mentorship.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlumniService {

    private final UserRepository userRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final SkillRepository skillRepository;
    private final AlumniMapper alumniMapper;

    public List<AlumniListResponseDTO> getAllAlumni() {
        List<AlumniProfile> alumniProfiles = alumniProfileRepository.findAll();
        return alumniProfiles.stream()
                .map(alumniMapper::toDto)
                .collect(Collectors.toList());
    }

    public AlumniDetailResponseDTO getAlumniById(Long id) {
        AlumniProfile alumniProfile = alumniProfileRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Alumni not found with id: " + id));
        return alumniMapper.toAlumniDetailResponse(alumniProfile);
    }

    @Transactional
    public void updateProfile(String email, UpdateAlumniProfileRequestDTO request) {
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

        AlumniProfile alumniProfile = alumniProfileRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("Alumni profile not found"));

        if (request.getCurrentCompany() != null)
            alumniProfile.setCurrentCompany(request.getCurrentCompany());
        if (request.getCurrentTitle() != null)
            alumniProfile.setCurrentTitle(request.getCurrentTitle());
        if (request.getYearsOfExperience() != null)
            alumniProfile.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getGraduationYear() != null)
            alumniProfile.setGraduationYear(request.getGraduationYear());
        if (request.getLinkedinUrl() != null)
            alumniProfile.setLinkedinUrl(request.getLinkedinUrl());

        alumniProfileRepository.save(alumniProfile);
    }
}
