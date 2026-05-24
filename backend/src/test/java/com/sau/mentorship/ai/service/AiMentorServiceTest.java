package com.sau.mentorship.ai.service;

import com.sau.mentorship.ai.dto.ChatRequestDTO;
import com.sau.mentorship.ai.dto.ChatResponseDTO;
import com.sau.mentorship.ai.entity.ChatSession;
import com.sau.mentorship.ai.entity.Interaction;
import com.sau.mentorship.ai.repository.ChatSessionRepository;
import com.sau.mentorship.ai.repository.InteractionRepository;
import com.sau.mentorship.user.entity.User;
import com.sau.mentorship.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiMentorServiceTest {

    // RETURNS_DEEP_STUBS sayesinde zincirleme (fluent) metodları tek satırda taklit edeceğiz
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ChatClient chatClient;

    @Mock
    private VectorStore vectorStore;
    @Mock
    private ChatMemory chatMemory;
    @Mock
    private InteractionRepository interactionRepository;
    @Mock
    private ChatSessionRepository chatSessionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AiMentorService aiMentorService;

    @Test
    void testGetChatHistory_ReturnsInteractions() {
        // Arrange
        String chatId = "test-session-id";

        // MessageType enum mu string mi bilmediğimizden o kısmı çıkardık, içerik testi için gerekmiyor.
        List<Interaction> interactions = List.of(
                Interaction.builder().id(1L).chatId(chatId).content("Hello").build(),
                Interaction.builder().id(2L).chatId(chatId).content("Hi there!").build()
        );
        when(interactionRepository.findByChatIdAndIsHiddenFalseOrderByCreatedAtAsc(chatId)).thenReturn(interactions);

        // Act
        List<Interaction> result = aiMentorService.getChatHistory(chatId);

        // Assert
        assertEquals(2, result.size());
        assertEquals("Hello", result.get(0).getContent());
        verify(interactionRepository, times(1)).findByChatIdAndIsHiddenFalseOrderByCreatedAtAsc(chatId);
    }

    @Test
    void testGetUserSessions_ReturnsSessions() {
        // Arrange
        String userEmail = "test@student.com";
        List<ChatSession> sessions = List.of(
                ChatSession.builder().id("session1").title("Career Question").userEmail(userEmail).build()
        );
        when(chatSessionRepository.findByUserEmailAndIsHiddenFalseOrderByCreatedAtDesc(userEmail)).thenReturn(sessions);

        // Act
        List<ChatSession> result = aiMentorService.getUserSessions(userEmail);

        // Assert
        assertEquals(1, result.size());
        assertEquals("Career Question", result.get(0).getTitle());
        verify(chatSessionRepository, times(1)).findByUserEmailAndIsHiddenFalseOrderByCreatedAtDesc(userEmail);
    }

    @Test
    void testHideChatHistory_SoftDeletesInteractionsAndSession() {
        // Arrange
        String chatId = "test-session-id";

        // Act
        aiMentorService.hideChatHistory(chatId);

        // Assert
        verify(interactionRepository, times(1)).hideChatHistory(chatId);
        verify(chatSessionRepository, times(1)).hideSession(chatId);
    }

    @Test
    void testAskQuestion_CreatesNewSessionIfItDoesNotExist() {
        // Arrange
        ChatRequestDTO request = new ChatRequestDTO("How to become a Java Developer?", "new-session", "test@student.com");

        when(chatSessionRepository.existsById("new-session")).thenReturn(false);
        when(userRepository.findByEmail(request.getUserEmail())).thenReturn(Optional.empty());
        when(vectorStore.similaritySearch(any(SearchRequest.class))).thenReturn(List.of(new Document("Java Guide")));

        // RETURNS_DEEP_STUBS sayesinde bütün o spec sınıfları yerine sadece bunu yazmak yetiyor!
        when(chatClient.prompt()
                .advisors(any(org.springframework.ai.chat.client.advisor.api.Advisor.class))
                .system(any(Consumer.class))
                .user(anyString())
                .call()
                .content()
        ).thenReturn("Learn Spring Boot.");

        // Act
        ChatResponseDTO response = aiMentorService.askQuestion(request, null);

        // Assert
        assertEquals("Learn Spring Boot.", response.getAnswer());
        verify(chatSessionRepository, times(1)).save(any(ChatSession.class)); // Yeni oturum kaydedildiğini doğrula
        verify(vectorStore, times(1)).similaritySearch(any(SearchRequest.class)); // RAG yapıldığını doğrula
    }
}