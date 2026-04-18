package com.sau.mentorship.users.controller;

import com.sau.mentorship.users.DTO.response.AlumniDetailResponseDTO;
import com.sau.mentorship.users.DTO.response.AlumniListResponseDTO;
import com.sau.mentorship.users.service.AlumniService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@RequiredArgsConstructor
public class AlumniController {

    private final AlumniService alumniService;

    @GetMapping
    public ResponseEntity<List<AlumniListResponseDTO>> getAllAlumni() {
        return ResponseEntity.ok(alumniService.getAllAlumni());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumniDetailResponseDTO> getAlumniById(@PathVariable Long id) {
        return ResponseEntity.ok(alumniService.getAlumniById(id));
    }
}
