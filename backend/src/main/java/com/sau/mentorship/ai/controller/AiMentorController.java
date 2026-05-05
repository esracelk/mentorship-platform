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

    @GetMapping("/sessions/{userEmail:.+}")
    public ResponseEntity<java.util.List<com.sau.mentorship.ai.entity.ChatSession>> getUserSessions(@PathVariable String userEmail) {
        return ResponseEntity.ok(aiMentorService.getUserSessions(userEmail));
    }

    @GetMapping("/history/{chatId:.+}")
    public ResponseEntity<java.util.List<com.sau.mentorship.ai.entity.Interaction>> getHistory(@PathVariable String chatId) {
        return ResponseEntity.ok(aiMentorService.getChatHistory(chatId));
    }

    @DeleteMapping("/history/{chatId:.+}")
    public ResponseEntity<Void> hideHistory(@PathVariable String chatId) {
        aiMentorService.hideChatHistory(chatId);
        return ResponseEntity.noContent().build();
    }
}
