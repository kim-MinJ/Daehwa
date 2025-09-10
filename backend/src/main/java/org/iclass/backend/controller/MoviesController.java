package org.iclass.backend.controller;

import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MoviesService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

  @GetMapping("/popular")
  public ResponseEntity<List<MovieInfoDto>> getPopularMovies(@RequestParam(defaultValue = "20") int count) {
    // 인기순으로 정렬하고 페이지 요청
    Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "popularity"));

    // 페이지 요청으로 인기 영화 가져오기
    List<MovieInfoEntity> movies = movieInfoRepository.findAll(pageable).getContent();

    // Entity → DTO 변환
    List<MovieInfoDto> dtos = movies.stream()
        .map(MovieInfoDto::of) // DTO 변환 메서드 사용
        .collect(Collectors.toList());

    return ResponseEntity.ok(dtos);
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