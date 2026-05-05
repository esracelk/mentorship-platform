package com.sau.mentorship.profile.student.DTO.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class StudentDetailResponseDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String aboutMe;
    private List<String> skills;
    private String department;
    private String grade;
    private String experience;
    private String employmentStatus;
    private String linkedinUrl;
    private String profilePhotoBase64;
}
