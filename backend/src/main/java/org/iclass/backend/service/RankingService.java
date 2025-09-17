package org.iclass.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {
    private final MovieVoteRepository movieVoteRepository;
    private final MovieInfoRepository movieInfoRepository;

    public List<MovieInfoEntity> getWeeklyRanking() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        List<Object[]> votes = movieVoteRepository.countVotesThisWeek(
                startOfWeek.atStartOfDay(),
                endOfWeek.atTime(23, 59, 59)
        );

        Map<Long, Long> voteMap = votes.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

        // 전체 영화 불러오기
        List<MovieInfoEntity> movies = movieInfoRepository.findAll();

        // 점수 계산 (이번 주 투표수 50% + popularity 30% + voteAverage 20%)
        return movies.stream()
                .sorted((a, b) -> {
                    double scoreA = (voteMap.getOrDefault(a.getTmdbMovieId(), 0L) * 0.5)
                                  + (a.getPopularity() * 0.3)
                                  + (a.getVoteAverage() * 0.2);
                    double scoreB = (voteMap.getOrDefault(b.getTmdbMovieId(), 0L) * 0.5)
                                  + (b.getPopularity() * 0.3)
                                  + (b.getVoteAverage() * 0.2);
                    return Double.compare(scoreB, scoreA); // 내림차순
                })
                .collect(Collectors.toList());
    }
}