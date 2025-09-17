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

    // 새로운 VS 생성
    @PostMapping("/ranking")
    public ResponseEntity<?> createVs(@RequestBody Map<String, List<Long>> payload) {
        List<Long> movieIds = payload.get("movieIds");
        if (movieIds == null || movieIds.size() != 2) {
            return ResponseEntity.badRequest().body("영화 2개를 선택해주세요");
        }

        MovieVsDto dto = MovieVsDto.builder()
                .movieVs1Idx(movieIds.get(0))
                .movieVs2Idx(movieIds.get(1))
                .active(1)
                .build();

        MovieVsDto saved = movieVsService.saveVs(dto);
        return ResponseEntity.ok(saved);
    }

    // 모든 VS 조회 (엔티티 그대로)
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
    

    // 관리자용 movievote 리스트
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

    // active=1인 VS 가져오기
    @GetMapping("/active")
    public ResponseEntity<MovieVsEntity> getActiveVs() {
        MovieVsEntity vs = movieVsService.getActiveRanking();
        if (vs == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(vs);
    }
}
