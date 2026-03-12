package com.sau.mentorship.users.repository;

import com.sau.mentorship.users.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByName(String name); //filtreleme için skill ismine göre skill bulma

    boolean existsByName(String name); //duplicate skill eklenmesini engellemek için skill ismine göre var mı yok mu kontrolü

}
