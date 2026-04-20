package com.sau.mentorship.profile.student.controller;

import com.sau.mentorship.profile.student.DTO.UpdateStudentProfileRequestDTO;
import com.sau.mentorship.profile.student.DTO.response.StudentDetailResponseDTO;
import com.sau.mentorship.profile.student.service.StudentService;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;
    private final UserRepository userRepository;

    @PutMapping("/update-profile")
    public ResponseEntity<String> updateStudentProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateStudentProfileRequestDTO request) {

        studentService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok("Student profile updated successfully.");
    }

    @PreAuthorize("hasRole('ALUMNI')")
    @GetMapping("/{studentId}")
    public ResponseEntity<StudentDetailResponseDTO> getStudentDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("studentId") Long studentId) {

        User loggedInAlumni = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        return ResponseEntity.ok(studentService.getStudentDetailForAlumni(studentId, loggedInAlumni.getId()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDetailResponseDTO> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(studentService.getStudentById(userId));
    }
}
