package com.sau.mentorship.ai.config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class CustomPersistentChatMemory implements ChatMemory {
    
    private final JdbcTemplate jdbcTemplate;

    public CustomPersistentChatMemory(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void add(String conversationId, List<Message> messages) {
        String sql = "INSERT INTO interaction (chat_id, message_type, content, is_hidden) VALUES (?, ?, ?, false)";
        for (Message message : messages) {
            jdbcTemplate.update(sql, conversationId, message.getMessageType().name(), message.getText());
        }
    }

    @Override
    public List<Message> get(String conversationId, int lastN) {
        String sql = "SELECT message_type, content FROM interaction WHERE chat_id = ? ORDER BY created_at DESC LIMIT ?";
        List<Message> messages = jdbcTemplate.query(sql, (rs, rowNum) -> {
            String type = rs.getString("message_type");
            String content = rs.getString("content");
            if ("USER".equals(type)) return new UserMessage(content);
            if ("ASSISTANT".equals(type)) return new AssistantMessage(content);
            if ("SYSTEM".equals(type)) return new SystemMessage(content);
            return new UserMessage(content);
        }, conversationId, lastN);
        
        Collections.reverse(messages);
        return messages;
    }

    @Override
    public void clear(String conversationId) {
        jdbcTemplate.update("DELETE FROM interaction WHERE chat_id = ?", conversationId);
    }
}
