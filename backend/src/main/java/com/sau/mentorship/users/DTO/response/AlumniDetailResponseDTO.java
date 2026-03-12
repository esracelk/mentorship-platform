package com.sau.mentorship.users.DTO.response;

public record AlumniDetailResponseDTO(
        Long id,
        String firstName,
        String lastName,

        // Ortak profil alanı
        String aboutMe,

        // Mezuna (Mentor) özel alanlar
        String currentCompany,
        String currentTitle,
        String graduationYear,
        String yearsOfExperience,
        String linkedinUrl

) {
}
