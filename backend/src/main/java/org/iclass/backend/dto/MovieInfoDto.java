package org.iclass.backend.dto;

import java.time.LocalDate;

import org.iclass.backend.asdf.MovieInfoEntity;

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
@Table(name = "Movie_Info")
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

    // ✅ Entity → DTO 변환
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

    // ✅ DTO → Entity 변환
    public MovieInfoEntity toEntity() {
        return MovieInfoEntity.builder()
                .movieIdx(this.movieIdx)
                .tmdbMovieId(this.tmdbMovieId)
                .title(this.title)
                .popularity(this.popularity)
                .voteCount(this.voteCount)
                .voteAverage(this.voteAverage)
                .adult(this.adult)
                .overview(this.overview)
                .backdropPath(this.backdropPath)
                .posterPath(this.posterPath)
                .releaseDate(this.releaseDate)
                .build();
    }
}
