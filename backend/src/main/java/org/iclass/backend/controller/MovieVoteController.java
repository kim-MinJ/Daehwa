package org.iclass.backend.controller;

import java.util.List;
import java.util.Map;

import org.iclass.backend.dto.VsBattleDto;
import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.service.MovieVoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vote")
@RequiredArgsConstructor
public class MovieVoteController {

    private final MovieVoteService movieVoteService;

    // ✅ 투표하기
    @PostMapping
    public ResponseEntity<?> vote(
            @RequestParam Long vsId,
            @RequestParam Long movieId,
            @RequestParam String userId) {   // userIdx → userId로 변경 (DB랑 일관성)
        try {
            MovieVoteDto result = movieVoteService.voteMovie(movieId, userId, vsId);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 이미 투표한 경우
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 유저/영화/VS 없음
        }
    }

    // ✅ 특정 VS 투표 결과
    @GetMapping("/{vsId}/result")
    public ResponseEntity<Map<Long, Long>> getVoteResult(@PathVariable Long vsId) {
        return ResponseEntity.ok(movieVoteService.getVoteResult(vsId));
    }

    // ✅ 이번 주 전체 투표 집계
    @GetMapping("/this-week")
    public ResponseEntity<Map<Long, Long>> getWeeklyVotes() {
        return ResponseEntity.ok(movieVoteService.getWeeklyVoteCounts());
    }

    // ✅ 특정 유저의 VS 투표 히스토리
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<VsBattleDto>> getVoteHistory(@PathVariable String userId) {
        return ResponseEntity.ok(movieVoteService.getVoteHistory(userId));
    }
}