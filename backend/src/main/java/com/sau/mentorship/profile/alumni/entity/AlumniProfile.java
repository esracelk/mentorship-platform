package com.sau.mentorship.profile.alumni.entity;

import com.sau.mentorship.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alumni_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumniProfile {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String currentCompany;

    private String currentTitle;

    private Integer yearsOfExperience;

    private Integer graduationYear;

    private String linkedinUrl;
}