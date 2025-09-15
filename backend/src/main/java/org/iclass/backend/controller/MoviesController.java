package org.iclass.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.service.MovieInfoService;
import org.iclass.backend.service.MoviesService;
import org.iclass.backend.service.MovieService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MoviesController {

  private final MovieService movieService;
  private final MoviesService moviesService;
  private final MovieInfoService movieInfoService;
  private final MovieInfoRepository movieInfoRepository;

  // =========================
  // 단일 영화 조회
  // =========================

  /** TMDB id 로 조회 */
  @GetMapping
  public ResponseEntity<MovieInfoDto> getByTmdb(@RequestParam(required = false) Long tmdbId) {
    if (tmdbId == null)
      return ResponseEntity.badRequest().build();
    return ResponseEntity.ok(movieService.getMovieByTmdbId(tmdbId));
  }

  /** movieIdx 기반 조회 */
  @GetMapping("/info/{movieIdx}")
  public ResponseEntity<MovieInfoDto> getMovieByIdx(@PathVariable Long movieIdx) {
    return ResponseEntity.ok(moviesService.getMovieById(movieIdx));
  }

  // =========================
  // 영화 관련 리스트 조회
  // =========================

  /** 비슷한 영화 */
  @GetMapping("/{id}/similar")
  public ResponseEntity<List<MovieInfoDto>> similar(@PathVariable Long id) {
    return ResponseEntity.ok(movieService.findSimilar(id));
  }

  /** 랜덤 영화 추천 */
  @GetMapping("/random")
  public ResponseEntity<MovieInfoDto> getRandomMovie() {
    MovieInfoEntity movie = moviesService.getRandomMovie();
    if (movie == null)
      return ResponseEntity.noContent().build();
    return ResponseEntity.ok(MovieInfoDto.of(movie));
  }

  /** 인기순 영화 */
  @GetMapping("/popular")
  public ResponseEntity<List<MovieInfoDto>> getPopularMovies(@RequestParam(defaultValue = "20") int count) {
    Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "popularity"));
    List<MovieInfoDto> dtos = movieInfoRepository.findAll(pageable)
        .getContent()
        .stream()
        .map(MovieInfoDto::of)
        .collect(Collectors.toList());
    return ResponseEntity.ok(dtos);
  }

  /** 전체 목록 / 검색 / 정렬 */
  @GetMapping("/list")
  public ResponseEntity<Page<MovieInfoDto>> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String sort) {
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

    return ResponseEntity.ok(pageData.map(MovieInfoDto::of));
  }

  /** 모든 영화 */
  @GetMapping("/all")
  public ResponseEntity<List<MovieInfoDto>> getAllMovies() {
    return ResponseEntity.ok(moviesService.getAllMovies());
  }

  /** 2010년대 인기 영화 */
  @GetMapping("/oldpopular")
  public ResponseEntity<List<MovieInfoDto>> getOldPopular(@RequestParam(defaultValue = "20") int count) {
    return ResponseEntity.ok(moviesService.getOldPopularMovies(count));
  }

  // =========================
  // 영화 메타 정보
  // =========================

  /** 영화 출연진 + 크루 정보 (TMDB-like) */
  @GetMapping("/{id}/credits")
  public ResponseEntity<Map<String, Object>> getCredits(@PathVariable Long id) {
    Map<String, Object> credits = moviesService.getCredits(id);
    return ResponseEntity.ok(credits);
  }

  /** 영화 비디오 / 예고편 (현재 빈 리스트) */
  @GetMapping("/{id}/videos")
  public ResponseEntity<Map<String, Object>> getVideos(@PathVariable Long id) {
    return ResponseEntity.ok(moviesService.getVideos(id));
  }

  /** 영화 감독 목록 */
  @GetMapping("/{tmdbMovieId}/directors")
  public ResponseEntity<List<String>> getDirectors(@PathVariable Long tmdbMovieId) {
    List<String> directors = movieInfoService.getDirectorsByTmdbId(tmdbMovieId);
    return ResponseEntity.ok(directors);
  }

  /** 영화 장르 목록 */
  @GetMapping("/{movieIdx}/genres")
  public ResponseEntity<List<String>> getGenres(@PathVariable Long movieIdx) {
    List<String> genres = movieInfoService.getGenresByMovieIdx(movieIdx);
    return ResponseEntity.ok(genres);
  }
}
