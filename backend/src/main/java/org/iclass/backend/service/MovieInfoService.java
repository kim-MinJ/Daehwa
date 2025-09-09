package org.iclass.backend.service;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieInfoService {
  private final MovieInfoRepository movieInfoRepository;

  public MovieInfoEntity getRandomMovie() {
    return movieInfoRepository.findRandomMovie();
  }
}