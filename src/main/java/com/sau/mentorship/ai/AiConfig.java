package com.sau.mentorship.ai;

import com.sau.mentorship.ai.config.CustomPersistentChatMemory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Bean
    public ChatMemory chatMemory(CustomPersistentChatMemory customPersistentChatMemory) {
        return customPersistentChatMemory;
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }
}
