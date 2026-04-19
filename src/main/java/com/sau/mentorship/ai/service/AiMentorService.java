package com.sau.mentorship.ai.service;

import com.sau.mentorship.ai.dto.ChatRequestDTO;
import com.sau.mentorship.ai.dto.ChatResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiMentorService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    private final String promptTemplate = """
            You are a Virtual Mentor for a career guidance platform. 
            Use the following pieces of retrieved context to answer the student's question.
            If the answer is not in the context, use your general knowledge but mention it is general advice.
            Be professional, encouraging, and supportive.
            
            CONTEXT:
            {context}
            
            QUESTION:
            {question}
            
            ANSWER:
            """;

    public ChatResponseDTO askQuestion(ChatRequestDTO request) {
        log.info("Processing question: {}", request.getQuestion());

        // RAG (Doküman Arama) kısmını şimdilik devre dışı bıraktık.
        // İlerleyen adımlarda burayı tekrar açacağız.
        String context = "Şu an döküman erişimi kapalı, genel mentor bilgisiyle cevap veriliyor.";

        // 2. Prompt Construction
        PromptTemplate template = new PromptTemplate(promptTemplate);
        Prompt prompt = template.create(Map.of(
                "context", context,
                "question", request.getQuestion()
        ));

        // 3. Local LLM Inference (Ollama)
        String answer = chatClient.prompt(prompt)
                .call()
                .content();

        return new ChatResponseDTO(answer);
    }
}
