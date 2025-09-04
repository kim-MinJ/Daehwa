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
    private int page;                       // 현재 페이지
    private int total_pages;                // 전체 페이지 수
    private int total_results;              // 전체 데이터 수
    private List<MovieInfoApiDto> results;  // 실제 영화 데이터

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
        private String release_date;
        private List<Long> genre_ids;
    }
}