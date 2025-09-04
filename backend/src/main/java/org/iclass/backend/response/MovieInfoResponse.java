package org.iclass.backend.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieInfoResponse {
    private List<MovieInfoApiDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieInfoApiDto {
        private Long movie_idx;
        private Long tmdb_movie_id;
        private String title;
        private Double popularity;
        private Integer vote_count;
        private Double vote_average;
        private Integer adult;
        private String overview;
        private String backdrop_path;
        private String poster_path;
        private String release_date; // API에서는 문자열로 오는 경우가 많음
    }
}