package com.sau.mentorship.user.controller;

import com.sau.mentorship.auth.DTO.ChangePasswordRequestDTO;
import com.sau.mentorship.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    /** Profil fotoğrafını Base64 olarak yükle / güncelle */
    @PostMapping("/photo")
    public ResponseEntity<String> uploadPhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        String base64 = body.get("photo");
        return ResponseEntity.ok(userService.uploadProfilePhoto(userDetails.getUsername(), base64));
    }

    /** Giriş yapan kullanıcının fotoğrafını getir */
    @GetMapping("/photo")
    public ResponseEntity<Map<String, String>> getMyPhoto(
            @AuthenticationPrincipal UserDetails userDetails) {
        String photo = userService.getProfilePhoto(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("photo", photo != null ? photo : ""));
    }
}
