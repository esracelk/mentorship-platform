package com.sau.mentorship.profile.alumni.DTO.response;

import java.util.List;

public record AlumniListResponseDTO (
     String fullName,
     String currentCompany,
     String currentTitle,
     List<String> skills
)
{ }
