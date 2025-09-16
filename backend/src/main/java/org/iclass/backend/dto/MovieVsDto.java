package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVsEntity;

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
@Table
public class MovieVsDto {
    private Long vsIdx;
    private Long movieVs1Idx; // MovieInfoEntity의 movieIdx
    private Long movieVs2Idx; // MovieInfoEntity의 movieIdx
    private Integer active; // 0: 비활성, 1: 활성
    private Integer vsRound;
    private Integer pair;
    private LocalDateTime startDate;
    private LocalDateTime endDate;


    // ✅ Entity → DTO 변환
    public static MovieVsDto of(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .movieVs1Idx(entity.getMovieVs1() != null ? entity.getMovieVs1().getMovieIdx() : null)
                .movieVs2Idx(entity.getMovieVs2() != null ? entity.getMovieVs2().getMovieIdx() : null)
                .active(entity.getActive())
                .build();
    }

    // ✅ DTO → Entity 변환
    public MovieVsEntity toEntity(MovieInfoEntity movieVs1, MovieInfoEntity movieVs2) {
        return MovieVsEntity.builder()
                .vsIdx(this.vsIdx)
                .movieVs1(movieVs1) // 연관관계 매핑 (MovieInfoEntity)
                .movieVs2(movieVs2) // 연관관계 매핑 (MovieInfoEntity)
                .active(this.active)
                .build();
    }
}
