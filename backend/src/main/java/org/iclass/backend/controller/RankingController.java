package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.repository.MovieVoteRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MovieVoteService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RankingController {

    private final MovieInfoRepository movieInfoRepository;
    private final MovieVoteService movieVoteService;

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingMovies() {
        var movies = movieInfoRepository.findAllWithGenres();

        // 정렬: null voteCount 방지
        movies.sort((a, b) -> Double.compare(
                (b.getVoteAverage() * ((b.getVoteCount() == null ? 0 : b.getVoteCount()) + 1)),
                (a.getVoteAverage() * ((a.getVoteCount() == null ? 0 : a.getVoteCount()) + 1))));

        var response = movies.stream().map(m -> {
            Map<String, Object> movie = new HashMap<>();
            movie.put("movieIdx", m.getMovieIdx());
            movie.put("tmdbMovieId", m.getTmdbMovieId());
            movie.put("title", Optional.ofNullable(m.getTitle()).orElse("제목없음"));
            movie.put("posterPath", Optional.ofNullable(m.getPosterPath()).orElse("/fallback.png"));
            movie.put("year", m.getReleaseDate() == null ? "N/A" : m.getReleaseDate().toString());
            movie.put("rating", Optional.ofNullable(m.getVoteAverage()).orElse(0.0));
            movie.put("overview", Optional.ofNullable(m.getOverview()).orElse(""));
            movie.put("genres", Optional.ofNullable(m.getGenres()).orElse(List.of()));
            movie.put("voteCount", Optional.ofNullable(m.getVoteCount()).orElse(0));
            return movie;
        }).toList();

        return ResponseEntity.ok(response);
    }

    /** ✅ 버튼 클릭 시 vote_count +1 */
    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestParam Long movieId,
            @RequestParam String userId) {
        try {
            // VS 없이 단일 영화 투표
            MovieVoteDto saved = movieVoteService.vote(movieId, userId);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private String mapGenreIdToName(int genreId) {
        switch (genreId) {
            case 28:
                return "Action";
            case 12:
                return "Adventure";
            case 16:
                return "Animation";
            case 35:
                return "Comedy";
            case 80:
                return "Crime";
            case 99:
                return "Documentary";
            case 18:
                return "Drama";
            case 10751:
                return "Family";
            case 14:
                return "Fantasy";
            case 36:
                return "History";
            case 27:
                return "Horror";
            case 10402:
                return "Music";
            case 9648:
                return "Mystery";
            case 10749:
                return "Romance";
            case 878:
                return "Science Fiction";
            case 10770:
                return "TV Movie";
            case 53:
                return "Thriller";
            case 10752:
                return "War";
            case 37:
                return "Western";
            default:
                return "Unknown";
        }
    }
}