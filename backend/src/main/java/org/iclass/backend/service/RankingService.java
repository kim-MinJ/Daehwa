package org.iclass.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.iclass.backend.entity.MovieCrewEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieCrewRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVoteRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {

    private final MovieVoteRepository movieVoteRepository;
    private final MovieInfoRepository movieInfoRepository;
    private final MovieCrewRepository movieCrewRepository;

    public List<Map<String, Object>> getTrendingMovies() {
        var movies = movieInfoRepository.findAllWithGenresMovies();

        // 정렬: null voteCount 방지
        movies.sort((a, b) -> Double.compare(
                (b.getVoteAverage() * ((b.getVoteCount() == null ? 0 : b.getVoteCount()) + 1)),
                (a.getVoteAverage() * ((a.getVoteCount() == null ? 0 : a.getVoteCount()) + 1))
        ));

        return movies.stream().map(m -> {
            Map<String, Object> movie = new HashMap<>();
            movie.put("movieIdx", m.getMovieIdx());
            movie.put("tmdbMovieId", m.getTmdbMovieId());
            movie.put("title", Optional.ofNullable(m.getTitle()).orElse("제목없음"));
            movie.put("posterPath", Optional.ofNullable(m.getPosterPath()).orElse("/fallback.png"));
            movie.put("year", m.getReleaseDate() == null ? "N/A" : m.getReleaseDate().toString());
            movie.put("rating", Optional.ofNullable(m.getVoteAverage()).orElse(0.0));
            movie.put("overview", Optional.ofNullable(m.getOverview()).orElse(""));
            movie.put("genres", Optional.ofNullable(m.getGenres()).orElse(List.of()));
            movie.put("voteCount", Optional.ofNullable(m.getVoteCount()).orElse(0));

            // ✅ 감독 이름 가져오기
            String director = movieCrewRepository
                    .findByTmdbMovieIdAndJob(m.getTmdbMovieId(), "Director")
                    .stream()
                    .findFirst()
                    .map(MovieCrewEntity::getCrewName)
                    .orElse("알 수 없음");

            movie.put("director", director);

            return movie;
        }).toList();
    }

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

        List<MovieInfoEntity> movies = movieInfoRepository.findAll();

        return movies.stream()
                .sorted((a, b) -> {
                    double scoreA = (voteMap.getOrDefault(a.getTmdbMovieId(), 0L) * 0.5)
                            + (a.getPopularity() * 0.3)
                            + (a.getVoteAverage() * 0.2);
                    double scoreB = (voteMap.getOrDefault(b.getTmdbMovieId(), 0L) * 0.5)
                            + (b.getPopularity() * 0.3)
                            + (b.getVoteAverage() * 0.2);
                    return Double.compare(scoreB, scoreA);
                })
                .collect(Collectors.toList());
    }
}