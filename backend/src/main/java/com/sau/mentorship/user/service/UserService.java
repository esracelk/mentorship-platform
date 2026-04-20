package com.sau.mentorship.user.service;

import com.sau.mentorship.auth.DTO.ChangePasswordRequestDTO;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.common.exception.UserNotFoundException;
import com.sau.mentorship.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getLoggedInUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional
    public String changePassword(String email, ChangePasswordRequestDTO request) {
        User user = getLoggedInUser(email);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Eski şifre yanlış.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Şifre başarıyla güncellendi.";
    }

    @Transactional
    public String deleteAccount(String email) {
        User user = getLoggedInUser(email);
        userRepository.delete(user);
        return "Hesap başarıyla silindi.";
    }
}
