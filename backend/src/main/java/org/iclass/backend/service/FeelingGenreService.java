package org.iclass.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.dto.FeelingMovieDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.FeelingGenreRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeelingGenreService {

  private final FeelingGenreRepository repository;

  // 감정 기반 영화 추천
  public List<FeelingMovieDto> getMoviesByFeeling(String feelingType, int count) {
    List<MovieInfoEntity> movies = repository.findDistinctMoviesByFeeling(
        feelingType,
        10);
    return movies.stream()
        .collect(Collectors.toMap(
            MovieInfoEntity::getMovieIdx,  // key
            FeelingMovieDto::fromEntity,   // value
            (a, b) -> a                    // 충돌 시 첫 번째
        ))
        .values().stream().toList();
  }

  public List<String> getAllFeelings() {
    return repository.findAllDistinctFeelings();
  }

}
