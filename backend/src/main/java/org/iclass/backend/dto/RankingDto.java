package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.Entity.RankingEntity;

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
@Table(name = "RANKING")
public class RankingDto {
    private Long rankingIdx;
    private Long movieIdx;      // MovieInfoEntity의 movieIdx
    private Integer rankingCount;
    private LocalDateTime createdDate;

    // Entity → DTO 변환 메서드
    public static RankingDto of(RankingEntity entity) {
        return RankingDto.builder()
                .rankingIdx(entity.getRankingIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .rankingCount(entity.getRankingCount())
                .createdDate(entity.getCreatedDate())
                .build();
    }
}