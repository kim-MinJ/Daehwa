package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.entity.CommentsEntity;
import org.iclass.backend.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentsRepository extends JpaRepository<CommentsEntity, Long> {
  List<CommentsEntity> findByReview(ReviewEntity review);

  List<CommentsEntity> findByReviewReviewIdx(Long reviewIdx);
}