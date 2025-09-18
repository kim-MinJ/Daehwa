package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.SearchMovieService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SearchMovieController {
    private final SearchMovieService service;

    // 전체 영화 조회
    @GetMapping("/api/searchMovie")
    public List<MovieInfoEntity> getAllMovies() {
        return service.getAllMovies();
    }

    // 단일 영화 조회
    @GetMapping("/api/movies/{id}")
    public MovieInfoEntity getMovieById(@PathVariable Long id) {
        return service.getMovieById(id);
    }

    // tmdb_movie_id로 조회
    @GetMapping("/api/searchMovie/tmdb/{tmdbId}")
    public MovieInfoEntity getMovieByTmdbId(@PathVariable Long tmdbId) {
        return service.getMovieByTmdbId(tmdbId);
    }
}