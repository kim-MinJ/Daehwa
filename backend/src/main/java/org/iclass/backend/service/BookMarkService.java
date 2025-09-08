package org.iclass.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.dto.BookMarkDto;
import org.iclass.backend.entity.BookMarkEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.BookmarkRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookMarkService {

  private final BookmarkRepository bookmarkRepository;
  private final UsersRepository usersRepository;
  private final MovieInfoRepository movieInfoRepository;

  // 유저 북마크 조회
  public List<BookMarkDto> getBookmarks(String userId) {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    List<BookMarkEntity> bookmarks = bookmarkRepository.findByUser(user);

    // movie 정보까지 포함한 DTO 반환
    return bookmarks.stream().map(b -> {
      BookMarkDto dto = BookMarkDto.of(b);
      if (b.getMovie() != null) {
        dto.setTitle(b.getMovie().getTitle());
        dto.setPosterPath(b.getMovie().getPosterPath());
      }
      return dto;
    }).collect(Collectors.toList());
  }

  // 북마크 추가
  public BookMarkDto addBookmark(String userId, Long movieIdx) {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    MovieInfoEntity movie = movieInfoRepository.findById(movieIdx)
        .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));

    // 이미 북마크 존재 여부 확인
    boolean exists = bookmarkRepository.findByUserAndMovie(user, movie).size() > 0;
    if (exists) {
      throw new RuntimeException("이미 북마크에 추가된 영화입니다.");
    }

    BookMarkEntity bookmark = BookMarkEntity.builder()
        .user(user)
        .movie(movie)
        .build();

    bookmark = bookmarkRepository.save(bookmark);

    return BookMarkDto.of(bookmark);
  }

  // 북마크 삭제
  public void removeBookmark(String userId, Long bookmarkIdx) {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    BookMarkEntity bookmark = bookmarkRepository.findById(bookmarkIdx)
        .orElseThrow(() -> new RuntimeException("북마크를 찾을 수 없습니다."));

    if (!bookmark.getUser().getUserId().equals(user.getUserId())) {
      throw new RuntimeException("본인의 북마크만 삭제할 수 있습니다.");
    }

    bookmarkRepository.delete(bookmark);
  }
}
