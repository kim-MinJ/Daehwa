package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.RankingDto;
import org.iclass.backend.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    // 랭킹 추가/업데이트
    @PostMapping("/{movieId}")
    public ResponseEntity<RankingDto> addOrUpdateRanking(@PathVariable Long movieId) {
        return ResponseEntity.ok(rankingService.addOrUpdateRanking(movieId));
    }

    // 오늘 급상승 TOP 10
    @GetMapping("/today-top10")
    public ResponseEntity<List<RankingDto>> getTodayTop10() {
        return ResponseEntity.ok(rankingService.getTodayTop10());
    }

    // 맞춤 추천 5개
    @GetMapping("/recommend")
    public ResponseEntity<List<RankingDto>> getRecommended2() {
        return ResponseEntity.ok(rankingService.getRecommended2());
    }
}
