package org.iclass.backend.dto;

import org.iclass.backend.Entity.MovieGenresEntity;

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
@Table(name = "MOVIE_GENRES")
public class MovieGenresDto {
    private Long mgIdx;
    private Long movieIdx;  // MovieInfoEntity의 movieIdx
    private Long genreIdx;  // GenresEntity의 genreIdx

    // Entity → DTO 변환 메서드
    public static MovieGenresDto of(MovieGenresEntity entity) {
        return MovieGenresDto.builder()
                .mgIdx(entity.getMgIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .genreIdx(entity.getGenre() != null ? entity.getGenre().getGenreIdx() : null)
                .build();
    }
}
