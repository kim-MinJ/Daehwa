package org.iclass.backend.dto;

import org.iclass.backend.asdf.MovieCastEntity;

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
@Table(name = "Movie_Cast")
public class MovieCastDto {

    private Long castIdx;          // 캐스 인덱스 (PK, 트리거로 생성)
    private Long tmdbMovieId;      // TMDB 영화 ID
    private Long tmdbCastId;       // TMDB 배우 ID
    private String character;      // 배역 이름
    private String castName;       // 배우 이름
    private String castProfilePath;// 배우 프로필 경로
    private Integer creditOrder;   // 배우 순서

    // ✅ Entity -> DTO 변환
    public static MovieCastDto of(MovieCastEntity entity) {
        return MovieCastDto.builder()
                .castIdx(entity.getCastIdx())
                .tmdbMovieId(entity.getTmdbMovieId())
                .tmdbCastId(entity.getTmdbCastId())
                .character(entity.getCharacter())
                .castName(entity.getCastName())
                .castProfilePath(entity.getCastProfilePath())
                .creditOrder(entity.getCreditOrder())
                .build();
    }

    // ✅ DTO -> Entity 변환
    public MovieCastEntity toEntity() {
        return MovieCastEntity.builder()
                .castIdx(this.castIdx)
                .tmdbMovieId(this.tmdbMovieId)
                .tmdbCastId(this.tmdbCastId)
                .character(this.character)
                .castName(this.castName)
                .castProfilePath(this.castProfilePath)
                .creditOrder(this.creditOrder)
                .build();
    }
}