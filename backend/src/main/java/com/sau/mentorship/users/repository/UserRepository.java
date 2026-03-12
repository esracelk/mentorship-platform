package com.sau.mentorship.users.repository;

import com.sau.mentorship.users.entity.User;
import com.sau.mentorship.users.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); //loign için email ile kullanıcı bulma
    boolean existsByEmail(String email);
    List<User> findByRole(Role role); //mentör veya mentee listesini çekmek için role ile kullanıcıları bulma
}
