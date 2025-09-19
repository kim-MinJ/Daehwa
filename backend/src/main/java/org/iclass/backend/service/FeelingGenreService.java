package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.FeelingGenreDto;
import org.iclass.backend.dto.FeelingMovieDto;
import org.iclass.backend.entity.FeelingGenreEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.FeelingGenreRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
        .map(FeelingMovieDto::fromEntity)
        .toList();
  }

  public List<String> getAllFeelings() {
    return repository.findAllDistinctFeelings();
  }

}
