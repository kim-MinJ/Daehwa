package org.iclass.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.iclass.backend.dto.CommentsDto;
import org.iclass.backend.entity.CommentsEntity;
import org.iclass.backend.entity.ReviewEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.CommentsRepository;
import org.iclass.backend.repository.ReviewRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
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

  public CommentsDto addComment(Long reviewId, String userId, String username, CommentsDto dto) {
    ReviewEntity review = reviewRepository.findById(reviewId)
        .orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다."));
    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("유저가 존재하지 않습니다."));

    CommentsEntity comment = CommentsEntity.builder()
        .review(review)
        .user(user)
        .content(dto.getContent())
        .build();
    CommentsEntity saved = commentsRepository.save(comment);
    return CommentsDto.of(saved);
  }

  @Transactional
  public void updateCommentContent(Long commentIdx, String content) {
    CommentsEntity comment = commentsRepository.findById(commentIdx)
        .orElseThrow(() -> new NoSuchElementException("댓글이 존재하지 않습니다."));
    comment.setContent(content);
  }

  @Transactional
  public void deleteComment(Long commentId) {
    commentsRepository.deleteById(commentId);
  }

  @Transactional
  public void hardDeleteCommentsByUser(String userId) {
    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));
    commentsRepository.deleteAllByUser(user);
  }

  @Transactional
  public void hardDeleteCommentsByReview(Long reviewId) {
    ReviewEntity review = reviewRepository.findById(reviewId)
        .orElseThrow(() -> new RuntimeException("리뷰 없음"));
    commentsRepository.deleteAllByReview(review);
  }

  public List<CommentsEntity> getAllComments() {
    return commentsRepository.findAll();
  }
}
