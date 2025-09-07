package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.Entity.BookMarkEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.BookmarkRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookMarkService {

  private final BookmarkRepository bookmarkRepository;
  private final UsersRepository usersRepository;

  // 유저 북마크 가져오기
  public List<BookMarkEntity> getBookmarks(String userId) {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    return bookmarkRepository.findByUser(user);
  }

  // 북마크 추가
  public BookMarkEntity addBookmark(String userId, Long movieId) {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    BookMarkEntity bookmark = BookMarkEntity.builder()
        .user(user)
        // movieId는 BookMarkEntity에 없으므로 필요하면 확장
        .build();
    return bookmarkRepository.save(bookmark);
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
