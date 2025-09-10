// package org.iclass.backend.controller;

// import org.iclass.backend.entity.MovieInfoEntity;

// import java.util.Collections;
// import java.util.List;
// import java.util.stream.Collectors;

// import org.iclass.backend.dto.MovieInfoDto;
// import org.iclass.backend.repository.MovieInfoRepository;
// import org.iclass.backend.entity.MovieInfoEntity;
// import org.iclass.backend.service.MoviesService;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.domain.Sort;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/movies")
// @RequiredArgsConstructor
// public class MoviesController {

//   private final MovieInfoRepository movieInfoRepository;
//   private final MoviesService moviesService;

//   @PostMapping("/fetch")
//   public String fetchMovies() {
//     moviesService.fetchAndSaveMovies();
//     return "Movies fetched!";
//   }

//   @GetMapping("/popular")
//   public ResponseEntity<List<MovieInfoDto>> getPopularMovies(@RequestParam(defaultValue = "20") int count) {
//     // 인기순으로 정렬하고 페이지 요청
//     Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "popularity"));

//     // 페이지 요청으로 인기 영화 가져오기
//     List<MovieInfoEntity> movies = movieInfoRepository.findAll(pageable).getContent();

//     // Entity → DTO 변환
//     List<MovieInfoDto> dtos = movies.stream()
//         .map(MovieInfoDto::of) // DTO 변환 메서드 사용
//         .collect(Collectors.toList());

//     return ResponseEntity.ok(dtos);
//   }

//   @GetMapping("/random")
//   public ResponseEntity<List<MovieInfoDto>> getRandomMovies(@RequestParam(defaultValue = "8") int count) {
//     List<MovieInfoEntity> allMovies = movieInfoRepository.findAll();
//     Collections.shuffle(allMovies);

//     List<MovieInfoDto> randomMovies = allMovies.stream()
//         .limit(count)
//         .map(entity -> {
//           MovieInfoDto dto = new MovieInfoDto();
//           dto.setMovieIdx(entity.getMovieIdx());
//           dto.setTitle(entity.getTitle());
//           dto.setPosterPath(entity.getPosterPath()); // posterPath 그대로 반환
//           return dto;
//         })
//         .toList();

//     return ResponseEntity.ok(randomMovies);
//   }
// }

// // 0908 1550 복구

package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.service.MovieService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MoviesController {

  private final MovieService movieService;
  private final MovieInfoRepository movieInfoRepository;

  @GetMapping("/{id}")
  public ResponseEntity<MovieInfoDto> getById(@PathVariable Long id) {
    return ResponseEntity.ok(movieService.getMovie(id));
  }

  @GetMapping("/{id}/similar")
  public ResponseEntity<List<MovieInfoDto>> similar(@PathVariable Long id) {
    return ResponseEntity.ok(movieService.findSimilar(id));
  }

  @GetMapping
  public ResponseEntity<MovieInfoDto> getByTmdb(@RequestParam(required = false) Long tmdbId) {
    if (tmdbId == null)
      return ResponseEntity.badRequest().build();
    return ResponseEntity.ok(movieService.getMovieByTmdbId(tmdbId));
  }

  // 목록/검색
  @GetMapping("/list")
  public ResponseEntity<Page<MovieInfoDto>> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String sort // 예: releaseDate,desc
  ) {
    // 기본 정렬: 최신순
    Sort sortObj = Sort.by(Sort.Direction.DESC, "releaseDate");

    if (sort != null && !sort.isBlank()) {
      String[] sp = sort.split(",", 2);
      String field = sp[0].trim();
      Sort.Direction dir = (sp.length > 1 && "asc".equalsIgnoreCase(sp[1].trim()))
          ? Sort.Direction.ASC
          : Sort.Direction.DESC;
      sortObj = Sort.by(dir, field);
    }

    Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sortObj);

    Page<MovieInfoEntity> pageData = (q == null || q.isBlank())
        ? movieInfoRepository.findAll(pageable)
        : movieInfoRepository.findByTitleContainingIgnoreCase(q, pageable);

    Page<MovieInfoDto> mapped = pageData.map(MovieInfoDto::of);
    return ResponseEntity.ok(mapped);
  }
}
