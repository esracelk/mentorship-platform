package com.sau.mentorship.ai.controller;

import com.sau.mentorship.ai.dto.ChatRequestDTO;
import com.sau.mentorship.ai.dto.ChatResponseDTO;
import com.sau.mentorship.ai.service.AiMentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow React frontend to access
public class AiMentorController {

    private final AiMentorService aiMentorService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponseDTO> ask(@RequestBody ChatRequestDTO request) {
        return ResponseEntity.ok(aiMentorService.askQuestion(request));
    }
}
