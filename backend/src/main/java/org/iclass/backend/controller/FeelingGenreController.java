package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.FeelingMovieDto;
import org.iclass.backend.service.FeelingGenreService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/feelings") // 여기 변경
@RequiredArgsConstructor
public class FeelingGenreController {

  private final FeelingGenreService service;

  // 감정 기반 추천 영화
  @GetMapping
  public List<FeelingMovieDto> getMoviesByFeeling(
      @RequestParam String feelingType,
      @RequestParam(name = "count", defaultValue = "10") int count) {
    return service.getMoviesByFeeling(feelingType, count);
  }

  @GetMapping("/all")
  public List<String> getAllFeelings() {
    return service.getAllFeelings(); // 위에서 만든 서비스 재사용
  }
}