package com.sau.mentorship.auth.service;

import com.sau.mentorship.auth.DTO.LoginRequestDTO;
import com.sau.mentorship.auth.DTO.RegisterRequestDTO;
import com.sau.mentorship.profile.alumni.entity.AlumniProfile;
import com.sau.mentorship.profile.student.entity.StudentProfile;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.user.enums.Role;
import com.sau.mentorship.users2.exception.EmailAlreadyExistsException;
import com.sau.mentorship.users2.exception.UserNotFoundException;
import com.sau.mentorship.profile.alumni.repository.AlumniProfileRepository;
import com.sau.mentorship.profile.student.repository.StudentProfileRepository;
import com.sau.mentorship.user.repository.UserRepository;
import com.sau.mentorship.auth.security.JwtService;
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
