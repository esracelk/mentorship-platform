package com.sau.mentorship.ai.repository;

import com.sau.mentorship.ai.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, String> {
    
    // Kullanıcının silinmemiş tüm sohbet oturumlarını en yenisi en üstte olacak şekilde getirir
    List<ChatSession> findByUserEmailAndIsHiddenFalseOrderByCreatedAtDesc(String userEmail);

    // Belirli bir sohbet oturumunu gizler (Soft Delete)
    @Modifying
    @Query("UPDATE ChatSession c SET c.isHidden = true WHERE c.id = :sessionId")
    void hideSession(@Param("sessionId") String sessionId);
}
