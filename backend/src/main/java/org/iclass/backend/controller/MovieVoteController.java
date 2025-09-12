package org.iclass.backend.controller;

import java.util.List;
import java.util.Map;

import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.service.MovieVoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movie/vote")
@RequiredArgsConstructor
public class MovieVoteController {

    private final MovieVoteService movieVoteService;

    /** ✅ 투표하기 */
    @PostMapping("/{vsId}/{tmdbMovieId}")
    public ResponseEntity<?> vote(
    @PathVariable Long vsId,
    @PathVariable Long tmdbMovieId,
    @RequestParam String userId
) {
    return ResponseEntity.ok(movieVoteService.vote(vsId, tmdbMovieId, userId));
}
    /** ✅ 특정 VS 투표 통계 */
    @GetMapping("/{vsId}/stats")
    public ResponseEntity<?> getVoteStats(@PathVariable Long vsId) {
    return ResponseEntity.ok(movieVoteService.getVoteStats(vsId));
}

    /** ✅ 전체 VS + 영화 정보 조회 */
    @GetMapping("/all")
    public List<Map<String, Object>> getAllVsWithMovies() {
        return movieVoteService.getAllVsWithMovies();
    }

    
}
