package org.iclass.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.Entity.BookMarkEntity;
import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.BookMarkDto;
import org.iclass.backend.repository.BookmarkRepository;
import org.iclass.backend.repository.MovieInfoRepository;
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
  private final MovieInfoRepository movieInfoRepository;

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
      @RequestParam Long movieIdx) {
    UsersEntity user = usersRepository.findByUserId(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

    MovieInfoEntity movie = movieInfoRepository.findById(movieIdx)
        .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));

    boolean exists = !bookmarkRepository.findByUserAndMovie(user, movie).isEmpty();
    if (exists)
      throw new RuntimeException("이미 북마크된 영화입니다.");

    BookMarkEntity bookmark = BookMarkEntity.builder()
        .user(user)
        .movie(movie)
        .build();

    bookmark = bookmarkRepository.save(bookmark);
    return ResponseEntity.ok(BookMarkDto.of(bookmark));
  }

  // 북마크 삭제
  @DeleteMapping("/{bookmarkIdx}")
  public ResponseEntity<Void> removeBookmark(@AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Long bookmarkIdx) {
    UsersEntity user = usersRepository.findByUserId(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

    BookMarkEntity bookmark = bookmarkRepository.findById(bookmarkIdx)
        .orElseThrow(() -> new RuntimeException("북마크를 찾을 수 없습니다."));

    if (!bookmark.getUser().getUserId().equals(user.getUserId())) {
      throw new RuntimeException("본인의 북마크만 삭제할 수 있습니다.");
    }

    bookmarkRepository.delete(bookmark);
    return ResponseEntity.noContent().build();
  }
}
