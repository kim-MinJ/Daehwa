package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.Entity.RankingEntity;
import org.iclass.backend.dto.RankingDto;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.RankingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RankingService {

    private final RankingRepository rankingRepository;
    private final MovieInfoRepository movieInfoRepository;

    private RankingDto toDto(RankingEntity entity) {
        return new RankingDto(
                entity.getRankingIdx(),
                entity.getMovie().getMovieIdx(),
                entity.getMovie().getTitle(),
                entity.getRankingCount(),
                entity.getCreatedDate()
        );
    }

    // 랭킹 저장 또는 업데이트
    public RankingDto addOrUpdateRanking(Long movieId) {
        MovieInfoEntity movie = movieInfoRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

        List<RankingEntity> existingList = rankingRepository.findByMovie(movie);
        RankingEntity ranking;

        if (existingList.isEmpty()) {
            ranking = new RankingEntity();
            ranking.setMovie(movie);
            ranking.setRankingCount(1);
        } else {
            ranking = existingList.get(0);
            ranking.setRankingCount(ranking.getRankingCount() + 1);
        }

        RankingEntity saved = rankingRepository.save(ranking);
        return toDto(saved);
    }

    // 오늘 급상승 TOP 10
    public List<RankingDto> getTodayTop10() {
        LocalDate today = LocalDate.now();

        return rankingRepository.findAll().stream()
                .filter(r -> r.getCreatedDate().toLocalDate().isEqual(today)) // 오늘만
                .sorted((a, b) -> b.getRankingCount().compareTo(a.getRankingCount())) // 카운트 내림차순
                .limit(10)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // 맞춤 추천 (랜덤 5개 - 샘플)
    public List<RankingDto> getRecommended2() {
        List<RankingEntity> all = rankingRepository.findAll();
        if (all.size() <= 3) {
            return all.stream().map(this::toDto).collect(Collectors.toList());
        }

        Random random = new Random();
        return random.ints(0, all.size())
                .distinct()
                .limit(3)
                .mapToObj(all::get)
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
