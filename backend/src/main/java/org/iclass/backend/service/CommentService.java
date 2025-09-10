package org.iclass.backend.service;

import java.util.List;

import org.iclass.backend.entity.CommentsEntity;
import org.iclass.backend.entity.ReviewEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.CommentsRepository;
import org.iclass.backend.repository.ReviewRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

  private final CommentsRepository commentsRepository;
  private final ReviewRepository reviewRepository;
  private final UsersRepository usersRepository;

  public List<CommentsEntity> getCommentsByReview(Long reviewId) {
    return commentsRepository.findByReviewReviewIdx(reviewId);
  }

  public CommentsEntity addComment(Long reviewId, String userId, String content) {
    ReviewEntity review = reviewRepository.findById(reviewId)
        .orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다."));

    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("유저가 존재하지 않습니다."));

    CommentsEntity comment = CommentsEntity.builder()
        .review(review)
        .user(user)
        .content(content)
        .build();

    return commentsRepository.save(comment);
  }

  public void deleteComment(Long commentId) {
    commentsRepository.deleteById(commentId);
  }
}