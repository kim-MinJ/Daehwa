package org.iclass.backend.controller;

import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.service.MoviesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MoviesController {

  private final MoviesService moviesService;

  public MoviesController(MoviesService moviesService) {
    this.moviesService = moviesService;
    this.moviesService.fetchAndSaveMovies(); // 서버 시작 시 인기 영화 DB 저장
  }

  @GetMapping("/api/movies/random")
  public MovieInfoEntity getRandomMovie() {
    return moviesService.getRandomMovie();
  }
}
