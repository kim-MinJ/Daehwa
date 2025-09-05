package org.iclass.backend.dto;

import org.iclass.backend.Entity.MovieVsEntity;

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
@Table(name = "Movie_VS")
public class MovieVsDto {
    private Long vsIdx;
    private Long movieVs1Idx;  // MovieInfoEntity의 movieIdx
    private Long movieVs2Idx;  // MovieInfoEntity의 movieIdx
    private Integer active;    // 0: 비활성, 1: 활성

    // Entity → DTO 변환 메서드
    public static MovieVsDto of(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .movieVs1Idx(entity.getMovieVs1() != null ? entity.getMovieVs1().getMovieIdx() : null)
                .movieVs2Idx(entity.getMovieVs2() != null ? entity.getMovieVs2().getMovieIdx() : null)
                .active(entity.getActive())
                .build();
    }
}