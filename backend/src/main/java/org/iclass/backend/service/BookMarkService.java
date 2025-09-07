package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.Entity.BookMarkEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.BookMarkDto;
import org.iclass.backend.repository.BookmarkRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookMarkService {

  private final BookmarkRepository bookMarkRepository;
  private final UsersRepository usersRepository;

  // 유저의 북마크 조회
  public List<BookMarkDto> getUserBookMarks(String userId) {
    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    return bookMarkRepository.findByUser(user)
        .stream()
        .map(BookMarkDto::of)
        .collect(Collectors.toList());
  }

  // 북마크 추가
  public BookMarkDto addBookMark(String userId) {
    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

    // 중복 체크
    boolean exists = bookMarkRepository.findByUser(user).stream().findAny().isPresent();
    if (exists) {
      throw new RuntimeException("이미 북마크한 상태입니다.");
    }

    BookMarkEntity entity = BookMarkEntity.builder()
        .user(user)
        .build();

    return BookMarkDto.of(bookMarkRepository.save(entity));
  }

  // 북마크 삭제
  public void removeBookMark(Long bookMarkIdx) {
    bookMarkRepository.deleteById(bookMarkIdx);
  }
}
