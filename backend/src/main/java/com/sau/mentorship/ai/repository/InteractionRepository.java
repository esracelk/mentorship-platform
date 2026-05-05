package com.sau.mentorship.ai.repository;

import com.sau.mentorship.ai.entity.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    
    // Yalnızca gizlenmemiş mesajları eskiden yeniye sıralı getirir (Arayüz için)
    List<Interaction> findByChatIdAndIsHiddenFalseOrderByCreatedAtAsc(String chatId);

    // Belirli bir sohbeti arayüzden gizler (Soft Delete)
    @Modifying
    @Query("UPDATE Interaction i SET i.isHidden = true WHERE i.chatId = :chatId")
    void hideChatHistory(@Param("chatId") String chatId);
}
