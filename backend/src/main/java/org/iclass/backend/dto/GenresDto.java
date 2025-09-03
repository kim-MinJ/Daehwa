package org.iclass.backend.dto;

import org.iclass.backend.Entity.GenresEntity;

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
@Table(name = "genres")
public class GenresDto {
  private Long genreIdx;
  private Long genreId;
  private String name;

  public static GenresDto of(GenresEntity entity) {
    return GenresDto.builder()
        .genreIdx(entity.getGenreIdx())
        .genreId(entity.getGenreId())
        .name(entity.getName())
        .build();

  }
}
