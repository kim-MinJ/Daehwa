// backend/src/main/java/org/iclass/backend/controller/MovieController.java (REPLACE ALL)
package org.iclass.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api")
public class MovieController {

    @Value("${TMDB_API_KEY}")
    private String tmdbApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String TMDB = "https://api.themoviedb.org/3";

    // 영화 상세
    @GetMapping("/movies/{movieId}")
    public String getMovieById(@PathVariable String movieId) {
        String url = TMDB + "/movie/" + movieId
                + "?api_key=" + tmdbApiKey
                + "&language=ko-KR";
        return restTemplate.getForObject(url, String.class);
    }

    // 출연/스태프
    @GetMapping("/movies/{movieId}/credits")
    public String getCredits(@PathVariable String movieId) {
        String url = TMDB + "/movie/" + movieId + "/credits"
                + "?api_key=" + tmdbApiKey
                + "&language=ko-KR";
        return restTemplate.getForObject(url, String.class);
    }

    // 비슷한 영화
    @GetMapping("/movies/{movieId}/similar")
    public String getSimilar(@PathVariable String movieId,
            @RequestParam(defaultValue = "1") int page) {
        String url = TMDB + "/movie/" + movieId + "/similar"
                + "?api_key=" + tmdbApiKey
                + "&language=ko-KR"
                + "&page=" + page;
        return restTemplate.getForObject(url, String.class);
    }

    // 예고편/영상
    @GetMapping("/movies/{movieId}/videos")
    public String getVideos(@PathVariable String movieId) {
        String url = TMDB + "/movie/" + movieId + "/videos"
                + "?api_key=" + tmdbApiKey
                + "&language=ko-KR";
        return restTemplate.getForObject(url, String.class);
    }

    // 검색
    @GetMapping("/search/movie")
    public String searchMovies(@RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        String encoded = UriUtils.encode(query, StandardCharsets.UTF_8);
        String url = TMDB + "/search/movie"
                + "?api_key=" + tmdbApiKey
                + "&language=ko-KR"
                + "&include_adult=false"
                + "&page=" + page
                + "&query=" + encoded;
        return restTemplate.getForObject(url, String.class);
    }
}
