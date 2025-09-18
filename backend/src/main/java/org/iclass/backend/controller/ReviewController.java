package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.ReviewDto;
// import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

  private final ReviewService reviewService;
  private final UsersRepository usersRepository;

  @PostMapping
  public ResponseEntity<?> saveReview(@RequestBody ReviewDto reviewDto, Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("로그인 후 리뷰 작성이 가능합니다.");
    }

    String userId = authentication.getName();
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    ReviewDto saved = reviewService.saveReview(reviewDto, user);
    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<List<ReviewDto>> getReviews(
      @RequestParam(required = false) Long movieIdx) {
    List<ReviewDto> list;
    if (movieIdx != null) {
      list = reviewService.getReviewsByMovieIdx(movieIdx); // 🎬 특정 영화 리뷰 조회
    } else {
      list = reviewService.getAllReviews(); // 📃 전체 리뷰 조회
    }
    return ResponseEntity.ok(list);
  }

  // 내 리뷰만 조회
  // ReviewController.java
  @GetMapping("/myreview")
  public ResponseEntity<List<ReviewDto>> getMyReviews(Authentication authentication) {
    if (authentication == null)
      return ResponseEntity.status(401).build();

    String userId = authentication.getName();
    List<ReviewDto> myReviews = reviewService.getReviewsByUserId(userId);
    return ResponseEntity.ok(myReviews);
  }

  // 🔹 리뷰 상태 변경 (블라인드)
  @PatchMapping("/{reviewIdx}/status")
  public ResponseEntity<Void> updateReviewStatus(
      @PathVariable Long reviewIdx,
      @RequestBody ReviewDto reviewDto) {
    reviewService.updateReviewStatus(reviewIdx, reviewDto.getIsBlind());
    return ResponseEntity.ok().build();
  }

  // 🔹 리뷰 삭제
  @DeleteMapping("/{reviewIdx}")
  public ResponseEntity<Void> deleteReview(
      @PathVariable Long reviewIdx,
      Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(401).build(); // 로그인 안됨
    }

    String userId = authentication.getName(); // JWT에서 추출한 userId
    reviewService.deleteReview(reviewIdx, userId);

    return ResponseEntity.ok().build();
  }

  @GetMapping("/{reviewIdx}")
  public ResponseEntity<ReviewDto> getReviewByIdx(@PathVariable Long reviewIdx) {
    ReviewDto review = reviewService.getReviewByIdx(reviewIdx); // ✅ 단일 리뷰 조회 메서드 호출
    return ResponseEntity.ok(review);
  }

  // 리뷰 수정
  @PatchMapping("/{reviewIdx}")
  public ResponseEntity<ReviewDto> updateReview(
      @PathVariable Long reviewIdx,
      @RequestBody ReviewDto reviewDto,
      Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(401).build(); // 로그인 안됨
    }

    String userId = authentication.getName(); // JWT에서 추출한 userId
    ReviewDto updated = reviewService.updateReview(reviewIdx, reviewDto, userId);

    return ResponseEntity.ok(updated);
  }

}
