package org.iclass.backend.dto;

import java.util.Date;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MovieVoteDto {
    private Long voteIdx;
    private Long movieIdx;
    private String userId;
    private Long vsIdx;
    private Date vsDate;

    // Entity → DTO
    public static MovieVoteDto of(MovieVoteEntity entity) {
        return MovieVoteDto.builder()
                .voteIdx(entity.getVoteIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .vsIdx(entity.getMovieVS() != null ? entity.getMovieVS().getVsIdx() : null)
                .vsDate(entity.getVsDate())
                .build();
    }

    // DTO → Entity
    public MovieVoteEntity toEntity(MovieInfoEntity movie, UsersEntity user, MovieVsEntity movieVS) {
        return MovieVoteEntity.builder()
                .voteIdx(this.voteIdx)
                .movie(movie)
                .user(user)
                .movieVS(movieVS)
                .vsDate(this.vsDate != null ? this.vsDate : new Date())
                .build();
    }
}
