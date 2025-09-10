package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.entity.CommentsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.service.CommentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
      @RequestParam String content,
      @AuthenticationPrincipal UsersEntity user) { // JWT 인증된 사용자 정보
    return commentService.addComment(reviewId, user.getUserId(), content);
  }

  // 댓글 삭제
  @DeleteMapping("/comments/{commentId}")
  public void deleteComment(@PathVariable Long commentId) {
    commentService.deleteComment(commentId);
  }
}