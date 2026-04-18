package com.sau.mentorship.profile.alumni.DTO.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateAlumniProfileRequestDTO {
    private String firstName;
    private String lastName;
    private String aboutMe;
    private List<String> skills;

    private String currentCompany;
    private String currentTitle;
    private Integer yearsOfExperience;
    private Integer graduationYear;
    private String linkedinUrl;
}
