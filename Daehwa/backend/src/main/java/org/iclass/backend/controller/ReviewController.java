package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.ReviewDto;
// import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

  private final ReviewService reviewService;

  @PostMapping
  public ResponseEntity<ReviewDto> saveReview(@RequestBody ReviewDto reviewDto,
      @AuthenticationPrincipal UsersEntity user) {
    ReviewDto saved = reviewService.saveReview(reviewDto, user);
    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<List<ReviewDto>> getReviews() {
    List<ReviewDto> list = reviewService.getAllReviews();
    return ResponseEntity.ok(list);
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
  public ResponseEntity<Void> deleteReview(@PathVariable Long reviewIdx) {
    reviewService.deleteReview(reviewIdx);
    return ResponseEntity.ok().build();
  }
}
