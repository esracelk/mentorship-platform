package com.sau.mentorship.users.DTO.request;

import com.sau.mentorship.users.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class RegisterRequestDTO {
    @NotBlank(message = "Ad boş olamaz")
    private String firstName;

    @NotBlank(message = "Soyad boş olamaz")
    private String lastName;

    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi girin")
    private String email;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 8, message = "Şifre en az 8 karakter olmalı")
    private String password;

    @NotNull(message = "Rol seçimi zorunludur(STUDENT veya ALUMNI)")
    private Role role;
}
