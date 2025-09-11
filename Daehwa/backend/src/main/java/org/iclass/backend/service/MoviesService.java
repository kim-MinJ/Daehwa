package org.iclass.backend.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieCrewEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieCrewRepository;
import org.iclass.backend.repository.MovieGenresRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MoviesService {

    private final MovieCrewRepository movieCrewRepository;

    private final MovieGenresRepository movieGenresRepository;

  private final MovieInfoRepository movieInfoRepository;
  private final String API_KEY = "302b783e860b19b6822ef0a445e7ae53";
  private final String API_URL = "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=10&api_key=" + API_KEY;

  public MoviesService(MovieInfoRepository movieInfoRepository, MovieGenresRepository movieGenresRepository, MovieCrewRepository movieCrewRepository) {
    this.movieInfoRepository = movieInfoRepository;
    this.movieGenresRepository = movieGenresRepository;
    this.movieCrewRepository = movieCrewRepository;
  }

  // DB에 영화 저장 (TMDB 인기 영화 가져오기)
  public void fetchAndSaveMovies() {
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<Map> response = restTemplate.getForEntity(API_URL, Map.class);
    Map<String, Object> body = response.getBody();

    if (body != null && body.containsKey("results")) {
      List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");

      for (Map<String, Object> movieData : results) {
        Long tmdbId = ((Number) movieData.get("id")).longValue();
        if (movieInfoRepository.findByTmdbMovieId(tmdbId).isEmpty()) {
          MovieInfoEntity movie = MovieInfoEntity.builder()
              .tmdbMovieId(tmdbId)
              .title((String) movieData.get("title"))
              .overview((String) movieData.get("overview"))
              .posterPath((String) movieData.get("poster_path"))
              .backdropPath((String) movieData.get("backdrop_path"))
              .adult((Boolean) movieData.getOrDefault("adult", false))
              .popularity(((Number) movieData.getOrDefault("popularity", 0.0)).doubleValue())
              .voteAverage(((Number) movieData.getOrDefault("vote_average", 0.0)).doubleValue())
              .voteCount(((Number) movieData.getOrDefault("vote_count", 0)).intValue())
              .releaseDate(parseDate((String) movieData.get("release_date")))
              .build();
          movieInfoRepository.save(movie);
        }
      }
    }
  }

  // 랜덤 영화 1개 반환
  public MovieInfoEntity getRandomMovie() {
    return movieInfoRepository.findRandomMovie();
  }

  // 문자열 → LocalDate
  private LocalDate parseDate(String dateStr) {
    try {
      return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    } catch (Exception e) {
      return null;
    }
  }

  public MovieInfoDto getMovieById(Long movieIdx) {
    return movieInfoRepository.findById(movieIdx)
        .map(MovieInfoDto::of)
        .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));
  }

  public List<MovieInfoDto> getAllMovies() {
    return movieInfoRepository.findAll().stream()
        .map(MovieInfoDto::of)
        .toList();
  }

  // 장르 가져오기
  public List<String> getGenresByMovieIdx(Long movieIdx) {
    return movieGenresRepository.findByMovie_MovieIdx(movieIdx)
        .stream()
        .<String>map(entity -> entity.getGenre().getName())
        .toList();
  }

  // 감독 가져오기
  public List<String> getDirectorsByTmdbId(Long tmdbMovieId) {
    return movieCrewRepository.findByTmdbMovieIdAndJob(tmdbMovieId, "Director")
        .stream()
        .map(MovieCrewEntity::getCrewName)
        .toList();
  }
}
