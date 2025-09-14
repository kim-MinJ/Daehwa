// src/main/java/org/iclass/backend/controller/MovieVsController.java
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

    // VS 생성
    @PostMapping
    public ResponseEntity<MovieVsDto> createVs(@RequestParam Long movie1Id, @RequestParam Long movie2Id) {
        return ResponseEntity.ok(movieVsService.createVs(movie1Id, movie2Id));
    }

    // 전체 VS 조회 (엔티티 그대로)
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

    // 활성화된 VS 조회 (랭킹 페이지용)
    @GetMapping("/ranking")
    public ResponseEntity<MovieVsEntity> getRankingVotes() {
        MovieVsEntity ranking = movieVsService.getActiveRanking();
        return ResponseEntity.ok(ranking);
    }

    // 랭킹 페이지: 선택된 2개 영화 저장
    @PatchMapping("/ranking")
    public ResponseEntity<Void> saveRankingVotes(@RequestBody Map<String, Object> payload) {
        try {
            List<Integer> movieIds = (List<Integer>) payload.get("movieIds");
            if (movieIds == null || movieIds.size() != 2) {
                return ResponseEntity.badRequest().build();
            }
            movieVsService.setRankingVotes(
                    Long.valueOf(movieIds.get(0)),
                    Long.valueOf(movieIds.get(1))
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 🎬 관리자용: movievote 리스트
    @GetMapping("/movievote")
    public ResponseEntity<List<Map<String, Object>>> getMovieVoteList() {
        List<MovieVsEntity> vsList = movieVsService.getAllVs();

        List<Map<String, Object>> result = vsList.stream().map(vs -> {
            Map<String, Object> map = new HashMap<>();
            map.put("vsIdx", vs.getVsIdx());

            if (vs.getMovieVs1() != null) {
                map.put("movie1Idx", vs.getMovieVs1().getMovieIdx());
                map.put("movie1Title", vs.getMovieVs1().getTitle());
                map.put("movie1Poster", vs.getMovieVs1().getPosterPath());
                map.put("movie1Rating", vs.getMovieVs1().getVoteAverage());
                map.put("movie1Year",
                        vs.getMovieVs1().getReleaseDate() != null ? vs.getMovieVs1().getReleaseDate().getYear() : 0);
            }

            if (vs.getMovieVs2() != null) {
                map.put("movie2Idx", vs.getMovieVs2().getMovieIdx());
                map.put("movie2Title", vs.getMovieVs2().getTitle());
                map.put("movie2Poster", vs.getMovieVs2().getPosterPath());
                map.put("movie2Rating", vs.getMovieVs2().getVoteAverage());
                map.put("movie2Year",
                        vs.getMovieVs2().getReleaseDate() != null ? vs.getMovieVs2().getReleaseDate().getYear() : 0);
            }

            map.put("active", vs.getActive() == 1);
            map.put("totalVotes", 0); // 필요시 서비스에서 계산

            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }
}
