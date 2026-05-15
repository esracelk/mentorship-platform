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

    @PostMapping(value = "/ask", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ChatResponseDTO> ask(
            @RequestParam("question") String question,
            @RequestParam("chatId") String chatId,
            @RequestParam("userEmail") String userEmail,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        
        ChatRequestDTO request = new ChatRequestDTO(question, chatId, userEmail);
        return ResponseEntity.ok(aiMentorService.askQuestion(request, file));
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
