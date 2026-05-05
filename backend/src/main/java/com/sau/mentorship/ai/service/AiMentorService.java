package com.sau.mentorship.ai.service;

import com.sau.mentorship.ai.dto.ChatRequestDTO;
import com.sau.mentorship.ai.dto.ChatResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiMentorService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final ChatMemory chatMemory;
    private final com.sau.mentorship.ai.repository.InteractionRepository interactionRepository;
    private final com.sau.mentorship.ai.repository.ChatSessionRepository chatSessionRepository;
    private final com.sau.mentorship.user.repository.UserRepository userRepository;

    private final String promptTemplate = """
            # CURRENT STUDENT PROFILE:
            - Name: {studentName}
            - Role: {studentRole}
            - Background / About: {studentAbout}
            
            # ROLE: Virtual Career Mentor & Success Coach
            You are an elite Career Mentor on a high-end mentorship platform. Your goal is to guide students and alumni through their career journeys with wisdom, empathy, and practical, data-driven advice.
            
            # CORE BEHAVIORS:
            1. **Structured Guidance**: Organize your thoughts logically. Use clear headings and structured bullet points for readability.
            2. **Personalization**: Use the provided [DOCUMENT CONTEXT] and CURRENT STUDENT PROFILE to reference specific projects, skills, or experiences if they belong to the student's background. 
            3. **Contextual Awareness**: Rely heavily on [CONVERSATION HISTORY] to maintain the thread of the dialogue. If the student mentioned a goal 3 questions ago, bring it up again when relevant.
            4. **Proactive Advice**: Don't just answer the question; look for the "next step" the student should take. 
            5. **Clarity over Jargon**: Explain complex career concepts simply but professionally.
            
            # DATA SOURCES & TRUTH HIERARCHY:
            - **[DOCUMENT CONTEXT]**: This is your "Reference Library". It contains sample resumes, job descriptions, or career paths. Treat it as external knowledge unless the student says "that's me".
            - **[CONVERSATION HISTORY]**: This is your "Shared Reality". This is what you and the student have actually discussed. Trust this above all for identifying the student's name and goals.
            
            # OUTPUT FORMATTING:
            - Start with a brief, friendly acknowledgment.
            - Use **Markdown** bolding for emphasis on key terms.
            - Provide a **"Small Win of the Day"** action item at the end of every response. 
            - Keep a professional yet warm tone.
            - Response Language: Match the student's language exactly.
            
            # REFERENCE LIBRARY (CONTEXT):
            {context}
            """;
    public ChatResponseDTO askQuestion(ChatRequestDTO request) {
        log.info("Processing question: {} for sessionId: {}", request.getQuestion(), request.getChatId());

        String sessionId = request.getChatId();
        if (sessionId != null && !chatSessionRepository.existsById(sessionId)) {
            String title = request.getQuestion().length() > 30 
                    ? request.getQuestion().substring(0, 30) + "..." 
                    : request.getQuestion();
            
            com.sau.mentorship.ai.entity.ChatSession newSession = com.sau.mentorship.ai.entity.ChatSession.builder()
                    .id(sessionId)
                    .userEmail(request.getUserEmail() != null ? request.getUserEmail() : "guest_user")
                    .title(title)
                    .isHidden(false)
                    .build();
            chatSessionRepository.save(newSession);
        }

        com.sau.mentorship.user.entity.User user = request.getUserEmail() != null ? userRepository.findByEmail(request.getUserEmail()).orElse(null) : null;
        String studentName = user != null ? user.getFirstName() + " " + user.getLastName() : "Bilinmiyor";
        String studentRole = user != null ? user.getRole().name() : "Bilinmiyor";
        String studentAbout = (user != null && user.getAboutMe() != null) ? user.getAboutMe() : "Belirtilmemiş";

        // 1. RAG (Önceki dokümanları getir)
        List<Document> similarDocuments = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(request.getQuestion())
                        .topK(3)
                        .build()
        );

        String context = similarDocuments.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        final String finalContext = context.isEmpty() ? "No specific context found in documents." : context;

        // 2. Chat with Memory Advisor
        String answer = chatClient.prompt()
                .advisors(new MessageChatMemoryAdvisor(chatMemory, sessionId, 50))
                .system(s -> s.text(promptTemplate)
                        .params(Map.of(
                                "context", finalContext,
                                "studentName", studentName,
                                "studentRole", studentRole,
                                "studentAbout", studentAbout
                        )))
                .user(request.getQuestion())
                .call()
                .content();

        return new ChatResponseDTO(answer);
    }
    // YENI EKLENEN METOTLAR: Arayüz için sohbet geçmişi (sadece gizlenmemiş olanlar)
    public List<com.sau.mentorship.ai.entity.Interaction> getChatHistory(String chatId) {
        return interactionRepository.findByChatIdAndIsHiddenFalseOrderByCreatedAtAsc(chatId);
    }

    // Arayüzden silme işlemi (Soft Delete)
    @org.springframework.transaction.annotation.Transactional
    public void hideChatHistory(String chatId) {
        interactionRepository.hideChatHistory(chatId);
        chatSessionRepository.hideSession(chatId);
    }

    public List<com.sau.mentorship.ai.entity.ChatSession> getUserSessions(String userEmail) {
        return chatSessionRepository.findByUserEmailAndIsHiddenFalseOrderByCreatedAtDesc(userEmail);
    }
}
