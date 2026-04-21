package com.sau.mentorship.connection.controller;

import com.sau.mentorship.connection.DTO.ConnectionResponseDTO;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.user.repository.UserRepository;
import com.sau.mentorship.connection.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;
    private final UserRepository userRepository; // To fetch ID from UserDetails

    @PostMapping("/request/{alumniId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> requestConnection(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("alumniId") Long alumniId,
            @RequestBody(required = false) String message) {

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.requestConnection(user.getId(), alumniId, message));
    }

    @PutMapping("/{connectionId}/accept")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<String> acceptConnection(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("connectionId") Long connectionId) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.acceptConnection(connectionId, user.getId()));
    }

    @PutMapping("/{connectionId}/reject")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<String> rejectConnection(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("connectionId") Long connectionId) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.rejectConnection(connectionId, user.getId()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ConnectionResponseDTO>> getStudentConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.getConnectionsByStudent(user.getId()));
    }

    @GetMapping("/alumni")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<List<ConnectionResponseDTO>> getAlumniConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.getConnectionsByAlumni(user.getId()));
    }
}
