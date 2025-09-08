package org.iclass.backend.dto;

import org.iclass.backend.entity.BookMarkEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.UsersEntity;

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
    private String userId;           // UsersEntity의 userId
    private Long movieIdx;           // MovieInfoEntity의 movieIdx

    // 추가 정보(DB에 저장 안되는 정보)
    private String title;            // 영화 제목
    private String posterPath;       // 영화 포스터 경로

    // ✅ Entity → DTO 변환
    public static BookMarkDto of(BookMarkEntity entity) {
        return BookMarkDto.builder()
                .bookmarkIdx(entity.getBookmarkIdx())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .title(entity.getMovie() != null ? entity.getMovie().getTitle() : null)
                .posterPath(entity.getMovie() != null ? entity.getMovie().getPosterPath() : null)
                .build();
    }

    // ✅ DTO → Entity 변환
    public BookMarkEntity toEntity(UsersEntity user, MovieInfoEntity movie) {
        return BookMarkEntity.builder()
                .bookmarkIdx(this.bookmarkIdx)
                .user(user)     // 연관관계 매핑: UsersEntity
                .movie(movie)   // 연관관계 매핑: MovieInfoEntity
                .build();
    }
}
