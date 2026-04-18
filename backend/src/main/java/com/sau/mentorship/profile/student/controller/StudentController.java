package com.sau.mentorship.profile.student.controller;

import com.sau.mentorship.profile.student.DTO.UpdateStudentProfileRequestDTO;
import com.sau.mentorship.profile.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @PutMapping("/update-profile")
    public ResponseEntity<String> updateStudentProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateStudentProfileRequestDTO request) {
        studentService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok("Student profile updated successfully.");
    }

}
