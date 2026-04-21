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

    private final String promptTemplate = """
            # ROLE: Virtual Career Mentor & Success Coach
            You are an elite Career Mentor on a high-end mentorship platform. Your goal is to guide students and alumni through their career journeys with wisdom, empathy, and practical, data-driven advice.
            
            # CORE BEHAVIORS:
            1. **Structured Guidance**: Organize your thoughts logically. Use clear headings and structured bullet points for readability.
            2. **Personalization**: Use the provided [DOCUMENT CONTEXT] to reference specific projects, skills, or experiences if they belong to the student's background. 
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
        log.info("Processing question: {} for chatId: {}", request.getQuestion(), request.getChatId());

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
                .advisors(new MessageChatMemoryAdvisor(chatMemory))
                .system(s -> s.text(promptTemplate)
                        .params(Map.of(
                                "context", finalContext
                        )))
                .user(request.getQuestion())
                .advisors(a -> a.param(CHAT_MEMORY_CONVERSATION_ID_KEY, request.getChatId())
                                .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))
                .call()
                .content();

        return new ChatResponseDTO(answer);
    }
}
