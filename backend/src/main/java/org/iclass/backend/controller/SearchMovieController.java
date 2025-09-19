package org.iclass.backend.controller;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.SearchMovieService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SearchMovieController {

    private final SearchMovieService service;

    // 전체 영화 조회 + 페이징(최신순, 이름순, 인기순)
    @GetMapping("/api/searchMovie")
    public Page<MovieInfoEntity> getAllMovies(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(defaultValue = "popularity") String sortBy, // 디폴트 인기도순
        @RequestParam(defaultValue = "desc") String order,        // 내림차순
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String genre
    ) {
        Sort sort = order.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, limit, sort);

        if (query != null && !query.isEmpty()) {
            return service.searchMoviesByTitle(query, pageable);
        } else if (genre != null && !genre.isEmpty()) {
            return service.getMoviesByGenre(genre, pageable);
        } else {
            return service.getAllMovies(pageable);
        }
    }


    // 단일 영화 조회
    @GetMapping("/api/movie/{movieIdx}")
    public MovieInfoEntity getMovieBymovieIdx(@PathVariable Long movieIdx) {
        return service.getMovieBymovieIdx(movieIdx);
    }

    // tmdb_movie_id로 조회
    @GetMapping("/api/searchMovie/tmdb/{tmdbId}")
    public MovieInfoEntity getMovieByTmdbId(@PathVariable Long tmdbId) {
        return service.getMovieByTmdbId(tmdbId);
    }
}
