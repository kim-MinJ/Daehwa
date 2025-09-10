package org.iclass.backend.service;

import java.time.LocalDateTime;

import org.iclass.backend.dto.RankingDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.RankingEntity;
import org.iclass.backend.repository.RankingRepository;
import org.iclass.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewRankingService {

    private final ReviewRepository reviewRepository;
    private final RankingRepository rankingRepository;

    // ✅ 영화 리뷰 평균으로 Ranking 업데이트 후 DTO 반환
    @Transactional
    public RankingDto updateRanking(MovieInfoEntity movie) {
        // 1. 영화별 평균 별점 조회 (리뷰 없으면 0.0)
        double ratingAvg = reviewRepository.findAvgRatingByMovie(movie.getMovieIdx())
                .orElse(0.0);

        // 2. Ranking 조회 혹은 새로 생성
        RankingEntity ranking = rankingRepository.findByMovie(movie)
                .stream()
                .findFirst()
                .orElse(RankingEntity.builder().movie(movie).build());

        ranking.setRankingCount(ratingAvg);
        ranking.setCreatedDate(LocalDateTime.now());

        // 3. 저장
        ranking = rankingRepository.save(ranking);

        // 4. DTO 변환 후 반환
        return RankingDto.of(ranking);
    }

    // ✅ 영화 평균 별점만 DTO로 조회 (update 없이)
    public RankingDto getRankingDto(MovieInfoEntity movie) {
        double ratingAvg = reviewRepository.findAvgRatingByMovie(movie.getMovieIdx())
                .orElse(0.0);

        RankingEntity ranking = rankingRepository.findByMovie(movie)
                .stream()
                .findFirst()
                .orElse(RankingEntity.builder().movie(movie).build());

        ranking.setRankingCount(ratingAvg);
        ranking.setCreatedDate(LocalDateTime.now());

        ranking = rankingRepository.save(ranking);

        return RankingDto.of(ranking);
    }
}
