package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity, String> {
  Optional<UsersEntity> findByUserId(String userId);
}