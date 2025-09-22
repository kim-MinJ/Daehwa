package org.iclass.backend.dto;

import lombok.*;
import org.iclass.backend.entity.MovieInfoEntity;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeelingMovieDto {
  private Long movieIdx;
  private String title;
  private String posterPath;
  private String backdropPath;
  private String releaseDate; // 프론트가 문자열을 기대하므로 toString()
  private Double voteAverage;
  private List<String> genres; // 프론트에서 한글 변환

  public static FeelingMovieDto fromEntity(MovieInfoEntity m) {
    return FeelingMovieDto.builder()
        .movieIdx(m.getMovieIdx())
        .title(m.getTitle())
        .posterPath(m.getPosterPath())
        .backdropPath(m.getBackdropPath())
        .releaseDate(m.getReleaseDate() == null ? null : m.getReleaseDate().toString())
        .voteAverage(m.getVoteAverage())
        .genres(m.getGenres()) // MovieInfoEntity에 List<String> getGenres() 가정
        .build();
  }
}