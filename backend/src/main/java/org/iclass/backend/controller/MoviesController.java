package org.iclass.backend.controller;

import java.util.Collections;
import java.util.List;

import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.service.MoviesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MoviesController {

  private final MovieInfoRepository movieInfoRepository;
  private final MoviesService moviesService;

  @PostMapping("/fetch")
  public String fetchMovies() {
    moviesService.fetchAndSaveMovies();
    return "Movies fetched!";
  }

  @GetMapping("/random")
  public ResponseEntity<List<MovieInfoDto>> getRandomMovies(@RequestParam(defaultValue = "8") int count) {
    List<MovieInfoEntity> allMovies = movieInfoRepository.findAll();
    Collections.shuffle(allMovies);

    List<MovieInfoDto> randomMovies = allMovies.stream()
        .limit(count)
        .map(entity -> {
          MovieInfoDto dto = new MovieInfoDto();
          dto.setMovieIdx(entity.getMovieIdx());
          dto.setTitle(entity.getTitle());
          dto.setPosterPath(entity.getPosterPath()); // posterPath 그대로 반환
          return dto;
        })
        .toList();

    return ResponseEntity.ok(randomMovies);
  }
}

// 0908 1550 복구