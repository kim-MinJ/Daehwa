package org.iclass.backend.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.iclass.backend.entity.MovieCastEntity;
import org.iclass.backend.entity.MovieCrewEntity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieCreditResponse {

    @JsonProperty("id")
    private Long tmdbMovieId;

    @JsonProperty("cast")
    private List<CastDto> cast;

    @JsonProperty("crew")
    private List<CrewDto> crew;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CastDto {
        @JsonProperty("id")
        private Long tmdbCastId;

        @JsonProperty("known_for_department")
        private String knownForDepartment;

        @JsonProperty("name")
        private String name;

        @JsonProperty("original_name")
        private String originalName;

        @JsonProperty("profile_path")
        private String profilePath;

        @JsonProperty("cast_id")
        private Long castId;

        @JsonProperty("character")
        private String character;

        @JsonProperty("credit_id")
        private String creditId;

        @JsonProperty("order")
        private Integer creditOrder;

        public MovieCastEntity toEntity(Long tmdbMovieId) {
            return MovieCastEntity.builder()
                    .tmdbMovieId(tmdbMovieId)
                    .tmdbCastId(this.tmdbCastId)
                    .character(this.character)
                    .castName(this.name)
                    .castProfilePath(this.profilePath)
                    .creditOrder(this.creditOrder)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CrewDto {
        @JsonProperty("id")
        private Long tmdbCrewId;

        @JsonProperty("known_for_department")
        private String knownForDepartment;

        private String name;

        @JsonProperty("original_name")
        private String originalName;

        private Double popularity;

        @JsonProperty("profile_path")
        private String profilePath;

        @JsonProperty("job")
        private String job;

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