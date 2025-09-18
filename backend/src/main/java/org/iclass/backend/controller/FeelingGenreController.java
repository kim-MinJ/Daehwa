package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.FeelingGenreDto;
import org.iclass.backend.service.FeelingGenreService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feeling") // 여기 변경
@RequiredArgsConstructor
public class FeelingGenreController {

  private final FeelingGenreService service;

  // 감정 기반 추천 영화
  @GetMapping // 그대로 두면 /api/feeling?feelingType=편안함
  public List<FeelingGenreDto> getMoviesByFeeling(@RequestParam String feelingType) {
    return service.getMoviesByFeeling(feelingType);
  }
}