package com.sau.mentorship.profile.alumni.DTO.response;

import java.util.List;

public record AlumniDetailResponseDTO(
                Long id,
                String firstName,
                String lastName,

                // Ortak profil alanı
                String aboutMe,
                List<String> skills,

                // Mezuna (Mentor) özel alanlar
                String currentCompany,
                String currentTitle,
                Integer graduationYear,
                Integer yearsOfExperience,
                String linkedinUrl

) {
}
