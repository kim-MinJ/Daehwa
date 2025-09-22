package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;

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
public class MovieVoteDto {
    private Long voteIdx;      // PK
    private Long movieIdx;     // MovieInfoEntity의 movieIdx
    private String userId;     // UsersEntity의 userId
    private Long vsIdx;        // MovieVsEntity의 VS_idx
    private LocalDateTime vsDate; // 투표 날짜

    // ✅ Entity → DTO 변환
    public static MovieVoteDto of(MovieVoteEntity entity) {
        return MovieVoteDto.builder()
                .voteIdx(entity.getVoteIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .vsIdx(entity.getMovieVS() != null ? entity.getMovieVS().getVsIdx() : null)
                .build();
    }

    // ✅ DTO → Entity 변환
    // 주의: voteIdx는 DB에서 자동 생성되므로 일반적으로 매핑하지 않음
    public MovieVoteEntity toEntity(MovieInfoEntity movie, UsersEntity user, MovieVsEntity movieVS) {
        return MovieVoteEntity.builder()
                .movie(movie)   // 연관관계 매핑 (MovieInfoEntity)
                .user(user)     // 연관관계 매핑 (UsersEntity)
                .movieVS(movieVS) // 연관관계 매핑 (MovieVsEntity)
                .build();
    }
}
