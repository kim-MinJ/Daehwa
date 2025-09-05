package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.Entity.ReviewEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
  List<ReviewEntity> findByUser(UsersEntity user);
}