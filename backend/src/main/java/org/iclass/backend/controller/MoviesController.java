package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MovieInfoService;
import org.iclass.backend.service.MoviesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MoviesController {

  private final MoviesService moviesService;
  private final MovieInfoService movieInfoService;

  // 랜덤 추천 영화
  @GetMapping("/random")
  public ResponseEntity<MovieInfoDto> getRandomMovie() {
    MovieInfoEntity movie = moviesService.getRandomMovie();
    if (movie == null) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(MovieInfoDto.of(movie));
  }

  @GetMapping("/{tmdbMovieId}/directors")
  public ResponseEntity<List<String>> getDirectors(@PathVariable Long tmdbMovieId) {
    List<String> directors = movieInfoService.getDirectorsByTmdbId(tmdbMovieId);
    return ResponseEntity.ok(directors);
  }

  @GetMapping("/{movieIdx}/genres")
  public ResponseEntity<List<String>> getGenres(@PathVariable Long movieIdx) {
    List<String> genres = movieInfoService.getGenresByMovieIdx(movieIdx);
    return ResponseEntity.ok(genres);
  }
}
