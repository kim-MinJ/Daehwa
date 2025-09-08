package org.iclass.backend.dto;

import java.time.LocalDate;

import org.iclass.backend.Entity.MovieInfoEntity;

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
@Builder
@ToString
<<<<<<< HEAD
@Table(name = "movie_Info")
=======
@Table(name = "Movie_Info")
>>>>>>> ae25e7826b07dfc0a8f1cc5d79cdb317a3802a3a
public class MovieInfoDto {
    private Long movieIdx;
    private Long tmdbMovieId;
    private String title;
    private Double popularity;
    private Integer voteCount;
    private Double voteAverage;
    private Boolean adult; // 0: false, 1: true
    private String overview;
    private String backdropPath;
    private String posterPath;
    private LocalDate releaseDate;

    // Entity → DTO 변환 메서드
    public static MovieInfoDto of(MovieInfoEntity entity) {
        return MovieInfoDto.builder()
                .movieIdx(entity.getMovieIdx())
                .tmdbMovieId(entity.getTmdbMovieId())
                .title(entity.getTitle())
                .popularity(entity.getPopularity())
                .voteCount(entity.getVoteCount())
                .voteAverage(entity.getVoteAverage())
                .adult(entity.getAdult())
                .overview(entity.getOverview())
                .backdropPath(entity.getBackdropPath())
                .posterPath(entity.getPosterPath())
                .releaseDate(entity.getReleaseDate())
                .build();
    }
}
