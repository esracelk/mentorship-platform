package com.sau.mentorship.users.DTO.request;

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
