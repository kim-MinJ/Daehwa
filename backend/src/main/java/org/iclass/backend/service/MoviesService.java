package org.iclass.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieCastEntity;
import org.iclass.backend.entity.MovieCrewEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieCastRepository;
import org.iclass.backend.repository.MovieCrewRepository;
import org.iclass.backend.repository.MovieGenresRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoviesService {

  private final MovieCrewRepository movieCrewRepository;
  private final MovieGenresRepository movieGenresRepository;
  private final MovieInfoRepository movieInfoRepository;
  private final MovieCastRepository movieCastRepository;

  /** 랜덤 영화 1개 반환 */
  public MovieInfoEntity getRandomMovie() {
    return movieInfoRepository.findRandomMovie();
  }

  /** movieIdx 기반 단일 영화 조회 */
  public MovieInfoDto getMovieById(Long movieIdx) {
    return movieInfoRepository.findById(movieIdx)
        .map(MovieInfoDto::of)
        .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다."));
  }

  /** 전체 영화 조회 */
  public List<MovieInfoDto> getAllMovies() {
    return movieInfoRepository.findAll().stream()
        .map(MovieInfoDto::of)
        .toList();
  }

  /** 장르 가져오기 */
  public List<String> getGenresByMovieIdx(Long movieIdx) {
    return movieGenresRepository.findByMovie_MovieIdx(movieIdx)
        .stream()
        .map(entity -> entity.getGenre().getName())
        .toList();
  }

  /** 감독 가져오기 */
  public List<String> getDirectorsByTmdbId(Long tmdbMovieId) {
    return movieCrewRepository.findByTmdbMovieIdAndJob(tmdbMovieId, "Director")
        .stream()
        .map(MovieCrewEntity::getCrewName)
        .toList();
  }

  /**
   * 영화 출연진 + 크루 정보 (프론트 TMDB-like)
   */
  public Map<String, Object> getCredits(Long movieIdx) {
    MovieInfoEntity movie = movieInfoRepository.findById(movieIdx)
        .orElseThrow(() -> new RuntimeException("영화를 찾을 수 없습니다. id=" + movieIdx));

    List<MovieCastEntity> castEntities = movieCastRepository.findByTmdbMovieId(movie.getTmdbMovieId());
    List<MovieCrewEntity> crewEntities = movieCrewRepository.findByTmdbMovieId(movie.getTmdbMovieId());

    var cast = castEntities.stream()
        .map(c -> Map.of(
            "id", c.getTmdbCastId(),
            "name", c.getCastName() != null ? c.getCastName() : "",
            "character", c.getCharacter() != null ? c.getCharacter() : "",
            "profile_path", c.getCastProfilePath() != null ? c.getCastProfilePath() : ""))
        .toList();

    var crew = crewEntities.stream()
        .map(c -> Map.of(
            "id", c.getTmdbCrewId(),
            "name", c.getCrewName() != null ? c.getCrewName() : "",
            "job", c.getJob() != null ? c.getJob() : "",
            "profile_path", c.getCrewProfilePath() != null ? c.getCrewProfilePath() : ""))
        .toList();

    Map<String, Object> result = new HashMap<>();
    result.put("id", movie.getMovieIdx());
    result.put("cast", cast);
    result.put("crew", crew);

    return result;
  }

  /** 2010~2019 인기 영화 */
  public List<MovieInfoDto> getOldPopularMovies(int count) {
    return movieInfoRepository.findAll().stream()
        .filter(m -> m.getReleaseDate() != null)
        .filter(m -> {
          int year = m.getReleaseDate().getYear();
          return year >= 2010 && year <= 2019;
        })
        .sorted((a, b) -> Double.compare(b.getPopularity(), a.getPopularity()))
        .limit(count)
        .map(MovieInfoDto::of)
        .toList();
  }
}
