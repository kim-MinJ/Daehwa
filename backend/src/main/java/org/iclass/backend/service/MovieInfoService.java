package org.iclass.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieCrewEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieCrewRepository;
import org.iclass.backend.repository.MovieGenresRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieInfoService {
  private final MovieInfoRepository movieInfoRepository;

  private final MovieGenresRepository movieGenresRepository;
  private final MovieCrewRepository movieCrewRepository;

  public MovieInfoEntity getRandomMovie() {
    return movieInfoRepository.findRandomMovie();
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