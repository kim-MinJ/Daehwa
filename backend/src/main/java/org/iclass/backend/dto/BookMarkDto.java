package org.iclass.backend.dto;

import org.iclass.backend.Entity.BookMarkEntity;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "BOOKMARK")
public class BookMarkDto {
  private Long bookmarkIdx;
  private String userId; // UsersEntity의 userId를 가져옴
  private Long movieIdx; // MovieInfoEntity의 movieIdx 추가

  // 추가 정보
  private String title; // 영화 제목
  private String posterPath; // 영화 포스터

  // Entity → DTO 변환 메서드
  public static BookMarkDto of(BookMarkEntity entity) {
    return BookMarkDto.builder()
        .bookmarkIdx(entity.getBookmarkIdx())
        .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
        .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
        .title(entity.getMovie() != null ? entity.getMovie().getTitle() : null)
        .posterPath(entity.getMovie() != null ? entity.getMovie().getPosterPath() : null)
        .build();
  }
}

// 09.07 movieidx , title, poserPath 추가
