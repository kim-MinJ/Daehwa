package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.FeelingGenreDto;
import org.iclass.backend.entity.FeelingGenreEntity;
import org.iclass.backend.repository.FeelingGenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeelingGenreService {

  private final FeelingGenreRepository repository;

  // 감정 기반 영화 추천
  public List<FeelingGenreDto> getMoviesByFeeling(String feelingType) {
    List<FeelingGenreEntity> entities = repository.findByFeelingType(feelingType);

    // DTO 변환
    return entities.stream()
        .map(FeelingGenreDto::of)
        .collect(Collectors.toList());
  }
}
