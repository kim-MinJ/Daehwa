package org.iclass.backend.controller;

import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.service.MoviesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MoviesController {

  private final MoviesService moviesService;

  // 랜덤 추천 영화
  @GetMapping("/random")
  public ResponseEntity<MovieInfoDto> getRandomMovie() {
    MovieInfoEntity movie = moviesService.getRandomMovie();
    if (movie == null) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(MovieInfoDto.of(movie));
  }
}
