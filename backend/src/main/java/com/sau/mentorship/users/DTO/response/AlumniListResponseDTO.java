package com.sau.mentorship.users.DTO.response;

import java.util.List;

public record AlumniListResponseDTO (
     String fullName,
     String currentCompany,
     String currentTitle,
     List<String> skills
)
{ }
