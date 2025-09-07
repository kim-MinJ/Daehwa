package org.iclass.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.BookMarkDto;
import org.iclass.backend.repository.BookmarkRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookMarkController {

  private final BookmarkRepository bookmarkRepository;
  private final UsersRepository usersRepository;

  // 북마크 조회
  @GetMapping
  public ResponseEntity<List<BookMarkDto>> getBookmarks(@AuthenticationPrincipal UserDetails userDetails) {
    UsersEntity user = usersRepository.findByUserId(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    List<BookMarkDto> bookmarks = bookmarkRepository.findByUser(user)
        .stream()
        .map(BookMarkDto::of)
        .collect(Collectors.toList());
    return ResponseEntity.ok(bookmarks);
  }

  // 북마크 추가
  @PostMapping
  public ResponseEntity<BookMarkDto> addBookmark(@AuthenticationPrincipal UserDetails userDetails,
      @RequestBody BookMarkDto request) {
    UsersEntity user = usersRepository.findByUserId(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

    BookMarkDto dto = null;
    boolean alreadyExists = bookmarkRepository.findByUser(user)
        .stream()
        .anyMatch(b -> b.getBookmarkIdx().equals(request.getBookmarkIdx()));

    if (!alreadyExists) {
      var bookmark = new org.iclass.backend.Entity.BookMarkEntity();
      bookmark.setUser(user);
      bookmark = bookmarkRepository.save(bookmark);
      dto = BookMarkDto.of(bookmark);
    }

    return ResponseEntity.ok(dto);
  }

  // 북마크 삭제
  @DeleteMapping("/{bookmarkIdx}")
  public ResponseEntity<Void> removeBookmark(@AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Long bookmarkIdx) {
    UsersEntity user = usersRepository.findByUserId(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

    bookmarkRepository.findById(bookmarkIdx)
        .filter(b -> b.getUser().getUserId().equals(user.getUserId()))
        .ifPresent(bookmarkRepository::delete);

    return ResponseEntity.noContent().build();
  }
}
