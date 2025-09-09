package org.iclass.backend.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.iclass.backend.entity.MovieCrewEntity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieCrewResponse {

    @JsonProperty("id")
    private Long tmdbMovieId; // TMDB 영화 ID

    @JsonProperty("crew")
    private List<CrewDto> crew;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CrewDto {
        private Boolean adult;
        private Integer gender;

        @JsonProperty("id")
        private Long tmdbCrewId; // TMDB 인물 ID

        @JsonProperty("known_for_department")
        private String knownForDepartment;

        private String name; // 이름

        @JsonProperty("original_name")
        private String originalName;

        private Double popularity;

        @JsonProperty("profile_path")
        private String profilePath;

        @JsonProperty("credit_id")
        private String creditId;

        private String department; // JSON 필드만 사용, Entity에는 저장 안함
        private String job;        // Entity에 저장할 직책

        // DTO → Entity 변환
        public MovieCrewEntity toEntity(Long tmdbMovieId) {
            return MovieCrewEntity.builder()
                    .tmdbMovieId(tmdbMovieId)
                    .tmdbCrewId(this.tmdbCrewId)
                    .crewName(this.name)
                    .crewProfilePath(this.profilePath)
                    .job(this.job)
                    .build();
        }
    }
}
