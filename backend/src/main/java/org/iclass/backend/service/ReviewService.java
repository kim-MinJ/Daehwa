package org.iclass.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.dto.ReviewDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.ReviewEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.ReviewRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

  private final CommentService commentService;

  private final ReviewRepository reviewRepository;
  private final UsersRepository usersRepository;
  private final MovieInfoRepository movieInfoRepository;

  public ReviewDto saveReview(ReviewDto dto, UsersEntity user) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String userId = auth.getName(); // JWT subject (username)

    if (user == null) {
      throw new RuntimeException("로그인이 필요합니다.");
    }
    // 🔑 DB에서 유저 엔티티 조회
    UsersEntity users = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    // 🎬 영화 조회
    MovieInfoEntity movie = movieInfoRepository.findById(dto.getMovieIdx())
        .orElseThrow(() -> new RuntimeException("Movie not found"));

    // 📝 DTO → Entity 변환
    ReviewEntity entity = dto.toEntity(users, movie);

    // 💾 저장
    ReviewEntity saved = reviewRepository.save(entity);

    // DTO 반환
    return ReviewDto.of(saved);
  }

  // 리뷰 전체 조회
  public List<ReviewDto> getAllReviews() {
    List<ReviewEntity> entities = reviewRepository.findAllByOrderByCreatedAtDesc();
    return entities.stream().map(e -> {
      ReviewDto dto = ReviewDto.of(e);
      return dto;
    }).collect(Collectors.toList());
  }

  // 🔹 유저별 리뷰 조회
  // ReviewService.java
  public List<ReviewDto> getReviewsByUserId(String userId) {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return reviewRepository.findByUser(user)
        .stream()
        .map(ReviewDto::of) // 영화 제목 포함 DTO 변환
        .toList();
  }

  // 🔹 리뷰 블라인드 상태 변경
  public void updateReviewStatus(Long reviewIdx, int isBlind) {
    ReviewEntity review = reviewRepository.findById(reviewIdx)
        .orElseThrow(() -> new RuntimeException("Review not found"));
    review.setIsBlind(isBlind);
    reviewRepository.save(review);
  }

  // 🔹 리뷰 삭제 + 리뷰 댓글 하드 삭제
  @Transactional
  public void deleteReview(Long reviewIdx) {
    ReviewEntity review = reviewRepository.findById(reviewIdx)
        .orElseThrow(() -> new RuntimeException("Review not found"));

    // 1️⃣ 해당 리뷰의 댓글 모두 삭제
    commentService.hardDeleteCommentsByReview(reviewIdx);

    // 2️⃣ 리뷰 삭제
    reviewRepository.delete(review);
  }

  // 🔹 리뷰 단건 조회
  public ReviewDto getReviewByIdx(Long reviewIdx) {
    ReviewEntity entity = reviewRepository.findByReviewIdx(reviewIdx)
        .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
    return ReviewDto.of(entity);
  }

  // 리뷰 수정
  @Transactional
  public ReviewDto updateReview(Long reviewIdx, ReviewDto reviewDto, String userId) {
    ReviewEntity review = reviewRepository.findById(reviewIdx)
        .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    // 본인 or 관리자만 수정 가능
    if (!review.getUser().getUserId().equals(userId) && !"admin".equalsIgnoreCase(user.getRole())) {
      throw new RuntimeException("본인 또는 관리자만 리뷰를 수정할 수 있습니다.");
    }

    review.setContent(reviewDto.getContent());
    review.setRating(reviewDto.getRating());
    review.setUpdateAt(LocalDateTime.now());

    ReviewEntity saved = reviewRepository.save(review);
    return ReviewDto.of(saved);
  }

}