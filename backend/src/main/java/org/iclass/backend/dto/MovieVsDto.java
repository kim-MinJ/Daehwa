package org.iclass.backend.dto;

import java.util.Date;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVsEntity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MovieVsDto {
    private Long vsIdx;
    private Integer vsRound;
    private Integer pair;
    private Long movieVs1Idx;
    private Long movieVs2Idx;
    private Integer active;
    private Date startDate;
    private Date endDate;

    // Entity → DTO
    public static MovieVsDto of(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .vsRound(entity.getVsRound())
                .pair(entity.getPair())
                .movieVs1Idx(entity.getMovieVs1() != null ? entity.getMovieVs1().getMovieIdx() : null)
                .movieVs2Idx(entity.getMovieVs2() != null ? entity.getMovieVs2().getMovieIdx() : null)
                .active(entity.getActive())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .build();
    }

    // DTO → Entity
    public MovieVsEntity toEntity(MovieInfoEntity movieVs1, MovieInfoEntity movieVs2) {
        return MovieVsEntity.builder()
                .vsIdx(this.vsIdx)
                .vsRound(this.vsRound)
                .pair(this.pair)
                .movieVs1(movieVs1)
                .movieVs2(movieVs2)
                .active(this.active != null ? this.active : 1)
                .startDate(this.startDate != null ? this.startDate : new Date())
                .endDate(this.endDate)
                .build();
    }
}
