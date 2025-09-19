package org.iclass.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.dto.VsBattleDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.MovieCrewRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVoteRepository;
import org.iclass.backend.repository.MovieVSRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieVoteService {

    private final MovieVoteRepository movieVoteRepository;
    private final MovieInfoRepository movieInfoRepository;
    private final UsersRepository usersRepository;
    private final MovieVSRepository movieVsRepository;
    private final MovieCrewRepository movieCrewRepository;

    /**
     * ✅ 영화 투표 (1일 1회 제한)
     */
    public MovieVoteDto voteMovie(Long movieId, String userId) {
        // 유저 조회
        UsersEntity user = usersRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음: " + userId));

        // 영화 조회
        MovieInfoEntity movie = movieInfoRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

        // 오늘 하루의 시작/끝 시간
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        // 중복 투표 확인
        movieVoteRepository.findTodayVote(movie, user, startOfDay, endOfDay)
                .ifPresent(v -> {
                    throw new IllegalStateException("오늘 이미 이 영화에 투표했습니다.");
                });

        // 새 투표 생성
        MovieVoteEntity vote = MovieVoteEntity.builder()
                .movie(movie)
                .user(user)
                .vsDate(LocalDateTime.now())
                .build();

        MovieVoteEntity saved = movieVoteRepository.save(vote);

        // ✅ Movie_Info 테이블의 voteCount 증가
        Integer current = movie.getVoteCount();
        if (current == null) current = 0;
        movie.setVoteCount(current + 1);
        movieInfoRepository.saveAndFlush(movie);

        return MovieVoteDto.of(saved);
    }

    /**
     * ✅ 특정 영화의 총 투표 수 (DB 집계 기준)
     */
    public long getVoteCount(Long movieId) {
        MovieInfoEntity movie = movieInfoRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));
        return movieVoteRepository.countByMovie_TmdbMovieId(movie.getTmdbMovieId());
    }

    /**
     * ✅ 이번 주 영화별 투표 집계 (tmdbMovieId 기준)
     */
    public Map<Long, Long> getWeeklyVoteCounts() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate end = today.with(java.time.DayOfWeek.SUNDAY);

        LocalDateTime startOfWeek = start.atStartOfDay();
        LocalDateTime endOfWeek = end.atTime(LocalTime.MAX);

        List<Object[]> results = movieVoteRepository.countVotesThisWeek(startOfWeek, endOfWeek);

        return results.stream()
                .collect(Collectors.toMap(
                        r -> (Long) r[0], // tmdbMovieId
                        r -> (Long) r[1]  // 투표 수
                ));
    }

    /**
     * ✅ VS 모드 결과 조회 (특정 VS에 대해 영화별 집계)
     */
    public Map<Long, Long> getVoteResult(Long vsId) {
        MovieVsEntity vs = movieVsRepository.findById(vsId)
                .orElseThrow(() -> new RuntimeException("VS not found"));

        var votes = movieVoteRepository.findByMovieVS(vs);

        Map<Long, Long> result = new HashMap<>();
        for (MovieVoteEntity vote : votes) {
            Long movieId = vote.getMovie().getMovieIdx();
            result.put(movieId, result.getOrDefault(movieId, 0L) + 1);
        }
        return result;
    }

    /**
     * ✅ 유저별 VS 투표 히스토리 조회 (RankingPage UI용)
     */
    public List<VsBattleDto> getUserVoteHistory(String userId) {
    UsersEntity user = usersRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

    List<MovieVoteEntity> votes = movieVoteRepository.findAll()
            .stream()
            .filter(v -> v.getUser().equals(user))
            .toList();

    List<VsBattleDto> history = new ArrayList<>();

    for (MovieVoteEntity vote : votes) {
        MovieVsEntity vs = vote.getMovieVS();
        if (vs == null) continue;

        // 날짜 계산
        long days = ChronoUnit.DAYS.between(
                vs.getStartDate().toInstant(),
                new Date().toInstant()
        );
        String daysAgoStr = (days == 0) ? "오늘" : days + "일 전";

        // 투표 집계
        var allVotes = movieVoteRepository.findByMovieVS(vs);
        long movie1Votes = allVotes.stream().filter(v -> v.getMovie().equals(vs.getMovieVs1())).count();
        long movie2Votes = allVotes.stream().filter(v -> v.getMovie().equals(vs.getMovieVs2())).count();
        long totalVotes = movie1Votes + movie2Votes;

        int movie1Percentage = totalVotes > 0 ? (int) ((movie1Votes * 100) / totalVotes) : 0;
        int movie2Percentage = 100 - movie1Percentage;

        history.add(VsBattleDto.builder()
                .vsIdx(vs.getVsIdx())
                .daysAgo(daysAgoStr)
                .totalVotes(totalVotes)
                .movie1Id(vs.getMovieVs1().getMovieIdx())
                .movie1Title(vs.getMovieVs1().getTitle())
                .movie1Poster(vs.getMovieVs1().getPosterPath())
                .movie1Director("TODO") // 필요시 crewRepo에서 가져오기
                .movie1Rating(vs.getMovieVs1().getVoteAverage())
                .movie1Votes(movie1Votes)
                .movie1Percentage(movie1Percentage)
                .movie2Id(vs.getMovieVs2().getMovieIdx())
                .movie2Title(vs.getMovieVs2().getTitle())
                .movie2Poster(vs.getMovieVs2().getPosterPath())
                .movie2Director("TODO")
                .movie2Rating(vs.getMovieVs2().getVoteAverage())
                .movie2Votes(movie2Votes)
                .movie2Percentage(movie2Percentage)
                .isMovie1Winner(movie1Votes >= movie2Votes)
                .votedMovieId(vote.getMovie().getMovieIdx())
                .build()
        );
    }

    return history;
}


    // ✅ DTO 변환 (단일)
    private MovieVoteDto toDto(MovieVoteEntity entity) {
        return MovieVoteDto.builder()
                .voteIdx(entity.getVoteIdx())
                .movieIdx(entity.getMovie().getMovieIdx())
                .userId(entity.getUser().getUserId())
                .build();
    }
}
