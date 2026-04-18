package com.sau.mentorship.users.service;

import com.sau.mentorship.users.DTO.request.LoginRequestDTO;
import com.sau.mentorship.users.DTO.request.RegisterRequestDTO;
import com.sau.mentorship.users.entity.AlumniProfile;
import com.sau.mentorship.users.entity.StudentProfile;
import com.sau.mentorship.users.entity.User;
import com.sau.mentorship.users.enums.Role;
import com.sau.mentorship.users.exception.EmailAlreadyExistsException;
import com.sau.mentorship.users.exception.UserNotFoundException;
import com.sau.mentorship.users.repository.AlumniProfileRepository;
import com.sau.mentorship.users.repository.StudentProfileRepository;
import com.sau.mentorship.users.repository.UserRepository;
import com.sau.mentorship.users.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public String register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already in use: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        if (request.getRole() == Role.STUDENT) {
            StudentProfile studentProfile = StudentProfile.builder()
                    .user(user)
                    .build();
            studentProfileRepository.save(studentProfile);
        } else if (request.getRole() == Role.ALUMNI) {
            AlumniProfile alumniProfile = AlumniProfile.builder()
                    .user(user)
                    .build();
            alumniProfileRepository.save(alumniProfile);
        }

        return jwtService.generateToken(user);
    }

    public String login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        return jwtService.generateToken(user);
    }
}
