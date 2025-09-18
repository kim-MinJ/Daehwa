package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MovieInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movie")
@RequiredArgsConstructor
public class MovieInfoController {
  private final MovieInfoService movieInfoService;

  @GetMapping("/random")
  public MovieInfoEntity getRandomMovie() {
    return movieInfoService.getRandomMovie();
  }

  @GetMapping
  public ResponseEntity<List<MovieInfoDto>> getAllMovies() {
    return ResponseEntity.ok(movieInfoService.getAllMovies());
  }

}