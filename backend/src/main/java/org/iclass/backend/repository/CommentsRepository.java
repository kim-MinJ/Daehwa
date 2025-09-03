package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentsRepository extends JpaRepository<CommentsEntity, Long> {
  List<CommentsEntity> findByReview(ReviewEntity review);
}