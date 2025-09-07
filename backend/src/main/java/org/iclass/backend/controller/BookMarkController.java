package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.BookMarkDto;
import org.iclass.backend.service.BookMarkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookMarkController {

  private final BookMarkService bookMarkService;

  // 유저의 북마크 조회
  @GetMapping("/{userId}")
  public List<BookMarkDto> getBookMarks(@PathVariable String userId) {
    return bookMarkService.getUserBookMarks(userId);
  }

  // 북마크 추가
  @PostMapping("/{userId}")
  public BookMarkDto addBookMark(@PathVariable String userId) {
    return bookMarkService.addBookMark(userId);
  }

  // 북마크 삭제
  @DeleteMapping("/{bookMarkIdx}")
  public void removeBookMark(@PathVariable Long bookMarkIdx) {
    bookMarkService.removeBookMark(bookMarkIdx);
  }
}
