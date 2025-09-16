package org.iclass.backend.service;

import java.util.Collections;
import java.util.List;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {

  private final MovieInfoRepository movieInfoRepository;

  // TMDB API 연동을 위한 정보 (사용하지 않아도 됨)
  private final String API_KEY = "302b783e860b19b6822ef0a445e7ae53";

  /**
   * DB ID 기준 단일 영화 조회
   */
  public MovieInfoDto getMovie(Long id) {
    MovieInfoEntity entity = movieInfoRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    return MovieInfoDto.of(entity);
  }

  /**
   * TMDB ID 기준 단일 영화 조회
   */
  public MovieInfoDto getMovieByTmdbId(Long tmdbId) {
    MovieInfoEntity entity = movieInfoRepository.findByTmdbMovieId(tmdbId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    return MovieInfoDto.of(entity);
  }

  /**
   * 비슷한 영화 목록을 DB 기준으로 가져오기
   * - 인기 영화 상위 100개 중 장르 겹치는 영화
   * - 자신 영화 제외, 최대 20개 반환
   */
  public List<MovieInfoDto> findSimilar(Long id) {
    // 1️⃣ 영화 가져오기
    MovieInfoEntity movie = movieInfoRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

    List<String> genres = movie.getGenres(); // 장르 리스트
    if (genres.isEmpty())
      return Collections.emptyList();

    // 앞쪽 2개 장르만 사용
    List<String> keyGenres = genres.subList(0, Math.min(2, genres.size()));

    // 2️⃣ 인기 영화 상위 100개 가져오기
    Pageable top100 = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "popularity"));
    List<MovieInfoEntity> popularMovies = movieInfoRepository.findAll(top100).getContent();

    // 3️⃣ 장르 겹치는 영화 필터 + 자신 제외
    List<MovieInfoEntity> similar = popularMovies.stream()
        .filter(m -> !m.getMovieIdx().equals(id)) // 자신 제외
        .filter(m -> m.getGenres().stream().anyMatch(keyGenres::contains)) // 앞쪽 2개 장르와 겹치는 것만
        .limit(20) // 최대 20개
        .toList();

    // 4️⃣ DTO 변환 후 반환
    return similar.stream().map(MovieInfoDto::of).toList();
  }
}
