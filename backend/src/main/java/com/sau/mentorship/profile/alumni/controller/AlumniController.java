package com.sau.mentorship.profile.alumni.controller;

import com.sau.mentorship.profile.alumni.DTO.request.UpdateAlumniProfileRequestDTO;
import com.sau.mentorship.profile.alumni.DTO.response.AlumniDetailResponseDTO;
import com.sau.mentorship.profile.alumni.DTO.response.AlumniListResponseDTO;
import com.sau.mentorship.profile.alumni.service.AlumniService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@RequiredArgsConstructor
public class AlumniController {

    private final AlumniService alumniService;

    @GetMapping
    public ResponseEntity<List<AlumniListResponseDTO>> getAllAlumni() {
        return ResponseEntity.ok(alumniService.getAllAlumni());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumniDetailResponseDTO> getAlumniById(@PathVariable("alumniId") Long alumniId) {
        return ResponseEntity.ok(alumniService.getAlumniById(alumniId));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateAlumniProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateAlumniProfileRequestDTO request) {
        alumniService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok("Alumni profile updated successfully.");
    }
}
