package com.sau.mentorship.profile.student.DTO.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StudentDetailResponseDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String aboutMe;
    private String department;
    private String grade;
    private String experience;
    private String linkedinUrl;
}
