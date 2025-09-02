package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<UsersEntity, String> {
  Optional<UsersEntity> findByUsername(String username);
}