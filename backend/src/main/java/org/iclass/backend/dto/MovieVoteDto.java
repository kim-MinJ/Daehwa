package org.iclass.backend.dto;

import org.iclass.backend.asdf.MovieInfoEntity;
import org.iclass.backend.asdf.MovieVoteEntity;
import org.iclass.backend.asdf.MovieVsEntity;
import org.iclass.backend.asdf.UsersEntity;

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
@Table(name = "Movie_Vote")
public class MovieVoteDto {
    private Long voteIdx;
    private Long movieIdx;   // MovieInfoEntity의 movieIdx
    private String userId;   // UsersEntity의 userId
    private Long vsIdx;      // MovieVsEntity의 VS_idx

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
    public MovieVoteEntity toEntity(MovieInfoEntity movie, UsersEntity user, MovieVsEntity movieVS) {
        return MovieVoteEntity.builder()
                .voteIdx(this.voteIdx)
                .movie(movie)      // 연관관계 매핑 (MovieInfoEntity)
                .user(user)        // 연관관계 매핑 (UsersEntity)
                .movieVS(movieVS)  // 연관관계 매핑 (MovieVsEntity)
                .build();
    }
}
