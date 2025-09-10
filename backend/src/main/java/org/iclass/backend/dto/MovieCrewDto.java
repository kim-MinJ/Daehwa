package org.iclass.backend.dto;

import org.iclass.backend.entity.MovieCrewEntity;

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
@Table(name = "Movie_Crew")
public class MovieCrewDto {

    private Long creditIdx; // 크루 인덱스 (PK, 트리거로 생성)
    private Long tmdbMovieId; // TMDB 영화 ID
    private Long tmdbCrewId; // TMDB 크루 ID
    private String crewName; // 감독 이름
    private String crewProfilePath;// 감독 프로필 경로
    private String job; // 직무 (ex: Director)

    // ✅ Entity -> DTO 변환
    public static MovieCrewDto of(MovieCrewEntity entity) {
        return MovieCrewDto.builder()
                .creditIdx(entity.getCreditIdx())
                .tmdbMovieId(entity.getTmdbMovieId())
                .tmdbCrewId(entity.getTmdbCrewId())
                .crewName(entity.getCrewName())
                .crewProfilePath(entity.getCrewProfilePath())
                .job(entity.getJob())
                .build();
    }

    // ✅ DTO -> Entity 변환
    public MovieCrewEntity toEntity() {
        return MovieCrewEntity.builder()
                .creditIdx(this.creditIdx)
                .tmdbMovieId(this.tmdbMovieId)
                .tmdbCrewId(this.tmdbCrewId)
                .crewName(this.crewName)
                .crewProfilePath(this.crewProfilePath)
                .job(this.job)
                .build();
    }
}