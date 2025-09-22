package org.iclass.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
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
    private final MovieInfoRepository movieInfoRepository;

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

    // 전체 영화 조회 + 페이징(최신순, 이름순, 인기순)
    @GetMapping("/api/temporary")
    public Page<MovieInfoEntity> temporary(
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



    @GetMapping("/api/nostalgicMovies")
    public List<MovieInfoEntity> nostalgicMovies(
            @RequestParam(defaultValue = "20") int limitPerDecade,
            @RequestParam(defaultValue = "popularity") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        Sort sort = order.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(0, limitPerDecade, sort);

        int[][] decadeRanges = { {1900, 1999}, {2000, 2009}, {2010, 2019} };
        List<MovieInfoEntity> combined = new ArrayList<>();

        for (int[] range : decadeRanges) {
            List<MovieInfoEntity> movies = movieInfoRepository.findByReleaseYearBetween(range[0], range[1], pageable).getContent();
            combined.addAll(movies);
        }

        // popularity 기준 최종 정렬
        combined.sort((a, b) -> b.getPopularity().compareTo(a.getPopularity()));

        return combined;
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
