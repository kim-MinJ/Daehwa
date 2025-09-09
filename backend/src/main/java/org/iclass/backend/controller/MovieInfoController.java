package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MovieInfoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class MovieInfoController {
  private final MovieInfoService movieInfoService;

  @GetMapping("/random")
  public MovieInfoEntity getRandomMovie() {
    return movieInfoService.getRandomMovie();
  }
}