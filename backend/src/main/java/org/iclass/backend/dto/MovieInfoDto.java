package org.iclass.backend.dto;

import java.time.LocalDate;

import org.iclass.backend.entity.MovieInfoEntity;

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
    private Long movieIdx;       // 내부 DB PK
    private Long tmdbMovieId;    // TMDB 고유 ID
    private String title;
    private Double popularity;
    private Integer voteCount;
    private Double voteAverage;
    private Boolean adult; 
    private String overview;
    private String backdropPath;
    private String posterPath;
    private LocalDate releaseDate;

    /** ✅ Entity → DTO 변환 */
    public static MovieInfoDto of(MovieInfoEntity entity) {
        return MovieInfoDto.builder()
                .movieIdx(entity.getMovieIdx())
                .tmdbMovieId(entity.getTmdbMovieId())
                .title(entity.getTitle() != null ? entity.getTitle() : "제목 없음")
                .popularity(entity.getPopularity() != null ? entity.getPopularity() : 0.0)
                .voteCount(entity.getVoteCount() != null ? entity.getVoteCount() : 0)
                .voteAverage(entity.getVoteAverage() != null ? entity.getVoteAverage() : 0.0)
                .adult(entity.getAdult() != null ? entity.getAdult() : false)
                .overview(entity.getOverview())
                .backdropPath(entity.getBackdropPath())
                .posterPath(entity.getPosterPath())
                .releaseDate(entity.getReleaseDate())
                .build();
    }

    /** ✅ DTO → Entity 변환 */
    public MovieInfoEntity toEntity() {
        return MovieInfoEntity.builder()
                .tmdbMovieId(this.tmdbMovieId)   // PK는 DB에서 자동 생성
                .title(this.title)
                .popularity(this.popularity != null ? this.popularity : 0.0)
                .voteCount(this.voteCount != null ? this.voteCount : 0)
                .voteAverage(this.voteAverage != null ? this.voteAverage : 0.0)
                .adult(this.adult != null ? this.adult : false)
                .overview(this.overview)
                .backdropPath(this.backdropPath)
                .posterPath(this.posterPath)
                .releaseDate(this.releaseDate)
                .build();
    }
}
