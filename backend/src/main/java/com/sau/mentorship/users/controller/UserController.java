package com.sau.mentorship.users.controller;

import com.sau.mentorship.users.DTO.request.ChangePasswordRequestDTO;
import com.sau.mentorship.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequestDTO request) {
        return ResponseEntity.ok(userService.changePassword(userDetails.getUsername(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.deleteAccount(userDetails.getUsername()));
    }
}
