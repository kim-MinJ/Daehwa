package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.RankingEntity;

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
    private Double rankingCount;
    private LocalDateTime createdDate;

    // ✅ Entity → DTO 변환
    public static RankingDto of(RankingEntity entity) {
        return RankingDto.builder()
                .rankingIdx(entity.getRankingIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .rankingCount(entity.getRankingCount())
                .createdDate(entity.getCreatedDate())
                .build();
    }

    // ✅ DTO → Entity 변환
    public RankingEntity toEntity(MovieInfoEntity movie) {
        return RankingEntity.builder()
                .rankingIdx(this.rankingIdx)
                .movie(movie)   // 연관관계 매핑 (MovieInfoEntity)
                .rankingCount(this.rankingCount)
                .createdDate(this.createdDate)
                .build();
    }
}
