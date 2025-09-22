package org.iclass.backend.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieInfoResponse {
    private List<MovieInfoApiDto> results;  // 실제 영화 데이터

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MovieInfoApiDto {
        private Long movie_idx;

        @JsonProperty("id")
        private Long tmdb_movie_id;
        
        private String title;
        private Double popularity;
        private Integer vote_count;
        private Double vote_average;
        private Boolean adult;
        private String overview;
        private String backdrop_path;
        private String poster_path;
        private String release_date;
        private List<Long> genre_ids;
    }
}