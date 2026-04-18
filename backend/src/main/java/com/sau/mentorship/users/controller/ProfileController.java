package com.sau.mentorship.users.controller;

import com.sau.mentorship.users.DTO.request.UpdateAlumniProfileRequestDTO;
import com.sau.mentorship.users.DTO.request.UpdateStudentProfileRequestDTO;
import com.sau.mentorship.users.service.AlumniService;
import com.sau.mentorship.users.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final StudentService studentService;
    private final AlumniService alumniService;

    @PutMapping("/student")
    public ResponseEntity<String> updateStudentProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateStudentProfileRequestDTO request) {
        studentService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok("Student profile updated successfully.");
    }

    @PutMapping("/alumni")
    public ResponseEntity<String> updateAlumniProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateAlumniProfileRequestDTO request) {
        alumniService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok("Alumni profile updated successfully.");
    }
}
