package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.BookMarkDto;
import org.iclass.backend.service.BookMarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookMarkController {

  private final BookMarkService bookMarkService;

  // 북마크 조회
  @GetMapping
  public ResponseEntity<List<BookMarkDto>> getBookmarks(@AuthenticationPrincipal UserDetails userDetails) {
    // 서비스에서 이미 DTO로 반환하므로 그대로 사용
    List<BookMarkDto> bookmarks = bookMarkService.getBookmarks(userDetails.getUsername());
    return ResponseEntity.ok(bookmarks);
  }

  // 북마크 추가
  @PostMapping
  public ResponseEntity<BookMarkDto> addBookmark(@AuthenticationPrincipal UserDetails userDetails,
      @RequestParam Long movieIdx) {
    BookMarkDto dto = bookMarkService.addBookmark(userDetails.getUsername(), movieIdx);
    return ResponseEntity.ok(dto);
  }

  // 북마크 삭제
  @DeleteMapping("/{bookmarkIdx}")
  public ResponseEntity<Void> removeBookmark(@AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Long bookmarkIdx) {
    bookMarkService.removeBookmark(userDetails.getUsername(), bookmarkIdx);
    return ResponseEntity.noContent().build();
  }
}
