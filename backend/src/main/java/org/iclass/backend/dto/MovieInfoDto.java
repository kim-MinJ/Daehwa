package org.iclass.backend.dto;

import java.time.LocalDateTime;

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
@Table(name = "Movie_Info")
public class MovieInfoDto {
  private Long movieIdx;
  private Long tmdbMovieId;
  private String title;
  private Double popularity;
  private Integer voteCount;
  private Double voteAverage;
  private Integer adult;
  private String overview;
  private String backdropPath;
  private String posterPath;
  private LocalDateTime releaseDate;

  public static MovieInfoDto of(MovieInfoEntity entity) {
    return MovieInfoDto.builder()
        .movieIdx(entity.getMovieIdx())
        .tmdbMovieId(entity.getMovieIdx())
        .title(entity.getTitle())
        .popularity(entity.getPopularity())
        .voteCount(entity.getVoteCount())
        .adult(entity.getAdult())
        .overview(entity.getOverview())
        .backdropPath(entity.getBackdropPath())
        .posterPath(entity.getPosterPath())
        .releaseDate(entity.getReleaseDate())
        .build();
  }

}
