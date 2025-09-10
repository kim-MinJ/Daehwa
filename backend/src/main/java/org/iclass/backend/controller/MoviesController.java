package org.iclass.backend.controller;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MoviesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
