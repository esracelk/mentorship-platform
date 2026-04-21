package com.sau.mentorship.profile.student.DTO;

import com.sau.mentorship.user.enums.EmploymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class UpdateStudentProfileRequestDTO {
    private String firstName;
    private String lastName;
    private String aboutMe;
    private List<String> skills;

    private LocalDate birthday;
    private EmploymentStatus employmentStatus;
    private String experience;
    private String department;
    private String grade;
    private String linkedinUrl;
}
