package com.sau.mentorship.profile.student.entity;

import com.sau.mentorship.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import com.sau.mentorship.user.enums.EmploymentStatus;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    private EmploymentStatus employmentStatus;


    private String experience;

    private String department;

    private String grade;

    private String linkedinUrl;
}