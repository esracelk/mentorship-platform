package com.sau.mentorship.users.controller;

import com.sau.mentorship.users.DTO.response.ConnectionResponseDTO;
import com.sau.mentorship.users.entity.User;
import com.sau.mentorship.users.repository.UserRepository;
import com.sau.mentorship.users.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> requestConnection(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long alumniId,
            @RequestBody(required = false) String message) {

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.requestConnection(user.getId(), alumniId, message));
    }

    @PutMapping("/{connectionId}/accept")
    public ResponseEntity<String> acceptConnection(@PathVariable Long connectionId) {
        return ResponseEntity.ok(connectionService.acceptConnection(connectionId));
    }

    @PutMapping("/{connectionId}/reject")
    public ResponseEntity<String> rejectConnection(@PathVariable Long connectionId) {
        return ResponseEntity.ok(connectionService.rejectConnection(connectionId));
    }

    @GetMapping("/student")
    public ResponseEntity<List<ConnectionResponseDTO>> getStudentConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.getConnectionsByStudent(user.getId()));
    }

    @GetMapping("/alumni")
    public ResponseEntity<List<ConnectionResponseDTO>> getAlumniConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionService.getConnectionsByAlumni(user.getId()));
    }
}
