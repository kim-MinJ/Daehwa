package org.iclass.backend.service;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

  private final ReviewRepository reviewRepository;
  private final UsersRepository usersRepository;
  private final MovieInfoRepository movieInfoRepository;

  public ReviewDto saveReview(ReviewDto dto, UsersEntity user) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String userId = auth.getName(); // JWT subject (username)

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

  // 🔹 리뷰 블라인드 상태 변경
  public void updateReviewStatus(Long reviewIdx, int isBlind) {
    ReviewEntity review = reviewRepository.findById(reviewIdx)
        .orElseThrow(() -> new RuntimeException("Review not found"));
    review.setIsBlind(isBlind);
    reviewRepository.save(review);
  }

  // 🔹 리뷰 삭제
  public void deleteReview(Long reviewIdx) {
    ReviewEntity review = reviewRepository.findById(reviewIdx)
        .orElseThrow(() -> new RuntimeException("Review not found"));
    reviewRepository.delete(review);
  }

}
