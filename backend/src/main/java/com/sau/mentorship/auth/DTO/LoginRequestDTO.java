package com.sau.mentorship.auth.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class LoginRequestDTO{
    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi girin")
    private String email;

    @NotBlank(message = "Şifre boş olamaz")
    private String password;
}
