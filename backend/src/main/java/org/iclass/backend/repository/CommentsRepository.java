package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.dto.CommentsDto;
import org.iclass.backend.entity.CommentsEntity;
import org.iclass.backend.entity.ReviewEntity;
import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentsRepository extends JpaRepository<CommentsEntity, Long> {

  List<CommentsDto> findByReview(ReviewEntity review);

  void deleteAllByUser(UsersEntity user);

  // **추가**: 특정 리뷰의 댓글 모두 삭제
  void deleteAllByReview(ReviewEntity review);

  void deleteAllByReviewIn(List<ReviewEntity> reviews);

  List<CommentsEntity> findByReviewReviewIdx(Long reviewIdx);

  List<CommentsEntity> findByUser(UsersEntity user);
}