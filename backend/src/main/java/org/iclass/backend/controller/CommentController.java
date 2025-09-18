package org.iclass.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.iclass.backend.dto.CommentsDto;
import org.iclass.backend.entity.CommentsEntity;
import org.iclass.backend.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;

  // 특정 리뷰의 댓글 목록 조회
  @GetMapping("/{reviewId}/comments")
  public List<CommentsEntity> getComments(@PathVariable Long reviewId) {
    return commentService.getCommentsByReview(reviewId);
  }

  // 댓글 작성
  @PostMapping("/{reviewId}/comments")
  public CommentsEntity addComment(
      @PathVariable Long reviewId,
      @RequestBody CommentsDto dto,
      @AuthenticationPrincipal UserDetails userDetails) { // ✅ UserDetails로 받음

    String username = userDetails.getUsername(); // 로그인한 사용자 아이디
    return commentService.addComment(reviewId, username, dto);
  }

  // 댓글 삭제
  @DeleteMapping("/comments/{commentId}")
  public void deleteComment(@PathVariable Long commentId) {
    commentService.deleteComment(commentId);
  }

  @GetMapping("/comments")
  public List<CommentsDto> getAllComments() {
    return commentService.getAllComments().stream()
        .map(CommentsDto::of) // DTO로 변환
        .toList();
  }

  @PutMapping("/{commentIdx}")
  public ResponseEntity<?> updateCommentContent(
      @PathVariable Long commentIdx,
      @RequestBody Map<String, String> body) {

    String content = body.get("content");
    if (content == null || content.isBlank()) {
      return ResponseEntity.badRequest().body("내용이 비어있습니다.");
    }

    try {
      commentService.updateCommentContent(commentIdx, content);
      return ResponseEntity.ok().build();
    } catch (NoSuchElementException e) {
      return ResponseEntity.notFound().build();
    }
  }
}