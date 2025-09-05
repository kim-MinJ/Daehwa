package org.iclass.backend.dto;

import org.iclass.backend.Entity.MovieVoteEntity;

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

    // Entity → DTO 변환 메서드
    public static MovieVoteDto of(MovieVoteEntity entity) {
        return MovieVoteDto.builder()
                .voteIdx(entity.getVoteIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .vsIdx(entity.getMovieVS() != null ? entity.getMovieVS().getVsIdx() : null)
                .build();
    }
}