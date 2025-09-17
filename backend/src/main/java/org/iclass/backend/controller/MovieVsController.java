package org.iclass.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.iclass.backend.dto.MovieVsDto;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.service.MovieVsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vs")
@RequiredArgsConstructor
public class MovieVsController {

    private final MovieVsService movieVsService;

    // 새로운 VS 생성 (pair 자동 증가, round는 프론트에서 전달)
    @PostMapping("/ranking")
    public ResponseEntity<?> createVs(@RequestBody Map<String, Object> payload) {
        // 프론트에서 movieIds와 round를 보낸다고 가정
        List<?> movieIdsObj = (List<?>) payload.get("movieIds");
        Integer round = (payload.get("round") != null) ? ((Number) payload.get("round")).intValue() : 1;

        if (movieIdsObj == null || movieIdsObj.size() != 2) {
            return ResponseEntity.badRequest().body("영화 2개를 선택해주세요");
        }

        Long movie1Id = ((Number) movieIdsObj.get(0)).longValue();
        Long movie2Id = ((Number) movieIdsObj.get(1)).longValue();

        MovieVsDto saved = movieVsService.createVs(movie1Id, movie2Id, round);
        return ResponseEntity.ok(saved);
    }

    // 모든 VS 조회
    @GetMapping
    public ResponseEntity<List<MovieVsEntity>> getAllVs() {
        return ResponseEntity.ok(movieVsService.getAllVs());
    }

    // 단일 VS 조회
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

    // 활성화된 VS 조회
    @GetMapping("/active")
    public ResponseEntity<MovieVsEntity> getActiveVs() {
        MovieVsEntity vs = movieVsService.getActiveVs();
        if (vs == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(vs);
    }

    @GetMapping("/movievote")
    public ResponseEntity<List<MovieVsEntity>> getMovieVoteList() {
        List<MovieVsEntity> vsList = movieVsService.getAllVs();
        return ResponseEntity.ok(vsList);
    }

    // VS의 active 상태 변경
    @PatchMapping("/movievote/{id}/active")
    public ResponseEntity<?> updateActive(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer active = body.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body("active 값이 필요합니다.");
        }

        movieVsService.updateActive(id, active);
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("active", active);
        return ResponseEntity.ok(response);
    }
}
