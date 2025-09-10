package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.MovieVsDto;
import org.iclass.backend.service.MovieVsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vs")
@RequiredArgsConstructor
public class MovieVsController {

    private final MovieVsService movieVsService;

    // VS 생성
    @PostMapping
    public ResponseEntity<MovieVsDto> createVs(@RequestParam Long movie1Id, @RequestParam Long movie2Id) {
        return ResponseEntity.ok(movieVsService.createVs(movie1Id, movie2Id));
    }

    // 전체 VS 조회
    @GetMapping
    public ResponseEntity<List<MovieVsDto>> getAllVs() {
        return ResponseEntity.ok(movieVsService.getAllVs());
    }

    // 특정 VS 조회
    @GetMapping("/{id}")
    public ResponseEntity<MovieVsDto> getVs(@PathVariable Long id) {
        return ResponseEntity.ok(movieVsService.getVs(id));
    }

    // VS 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVs(@PathVariable Long id) {
        movieVsService.deleteVs(id);
        return ResponseEntity.noContent().build();
    }
}