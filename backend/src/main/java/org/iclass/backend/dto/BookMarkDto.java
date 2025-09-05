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

  // Entity → DTO 변환 메서드
  public static BookMarkDto of(BookMarkEntity entity) {
    return BookMarkDto.builder()
        .bookmarkIdx(entity.getBookmarkIdx())
        .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
        .build();
  }
}
