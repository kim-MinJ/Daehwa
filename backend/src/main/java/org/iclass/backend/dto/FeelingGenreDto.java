package org.iclass.backend.dto;

import lombok.*;
import org.iclass.backend.entity.FeelingGenreEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeelingGenreDto {

  private Long feelingGenreIdx;
  private String feelingType;
  private Long genreIdx;
  private Long movieIdx;

  public static FeelingGenreDto of(FeelingGenreEntity entity) {
    return FeelingGenreDto.builder()
        .feelingGenreIdx(entity.getFeelingGenreIdx())
        .feelingType(entity.getFeelingType())
        .genreIdx(entity.getGenre().getGenreIdx())
        .movieIdx(entity.getMovie().getMovieIdx())
        .build();
  }
}
