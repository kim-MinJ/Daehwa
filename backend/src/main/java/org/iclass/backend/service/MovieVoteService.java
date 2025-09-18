package org.iclass.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVSRepository;
import org.iclass.backend.repository.MovieVoteRepository;
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
    private final MovieVSRepository movieVSRepository;
    private final UsersRepository usersRepository;

    /**
     * ✅ VS 기반 투표 (대결 모드)
     */
 public MovieVoteDto vote(Long movieId, String userId) {
    // 영화 & 유저 조회
    MovieInfoEntity movie = movieInfoRepository.findById(movieId)
            .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

    UsersEntity user = usersRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("유저 없음: " + userId));

//     // 오늘 자정 ~ 오늘 23:59:59 (중복 투표 방지용이므로 테스트할 때 주석 처리)
//     LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
//     LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

//     // 🔒 오늘 이미 투표했는지 체크
//     movieVoteRepository.findTodayVote(movie, user, startOfDay, endOfDay)
//             .ifPresent(v -> {
//                 throw new IllegalStateException("오늘 이미 이 영화에 투표했습니다.");
//             });

    // 투표 생성
    MovieVoteEntity vote = MovieVoteEntity.builder()
            .movie(movie)
            .user(user)
            .vsDate(LocalDateTime.now())
            .build();

    MovieVoteEntity saved = movieVoteRepository.save(vote);

    // ✅ voteCount 증가
    Integer current = movie.getVoteCount();
    if (current == null) current = 0;
    movie.setVoteCount(current + 1);
    movieInfoRepository.saveAndFlush(movie);

    return MovieVoteDto.of(saved);
}

    /**
     * ✅ 단일 영화 투표 (VS 없이)
     */
    public MovieVoteDto voteSingle(Long movieId, String userId) {
        MovieInfoEntity movie = movieInfoRepository.findByTmdbMovieId(movieId)
                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음: " + userId));

        // 🔒 중복 투표 방지 (영화+유저 기준)
        movieVoteRepository.findByMovieAndUser(movie, user).ifPresent(v -> {
            throw new IllegalStateException("이미 이 영화에 투표했습니다.");
        });

        MovieVoteEntity vote = MovieVoteEntity.builder()
                .movie(movie)
                .user(user)
                .vsDate(LocalDateTime.now())
                .build();

        MovieVoteEntity saved = movieVoteRepository.save(vote);

        // ✅ Movie_Info 테이블의 voteCount 증가
        incrementVoteCount(movie);

        return MovieVoteDto.of(saved);
    }

    /**
     * ✅ Movie_Info.voteCount +1
     */
    private void incrementVoteCount(MovieInfoEntity movie) {
        Integer current = movie.getVoteCount();
        movie.setVoteCount((current == null ? 0 : current) + 1);
        movieInfoRepository.saveAndFlush(movie);

        System.out.println("투표 반영됨 | movieIdx=" + movie.getMovieIdx()
                + " | 누적 voteCount=" + movie.getVoteCount());
    }

    /**
     * ✅ 특정 VS의 투표 결과 집계
     */
    public Map<Long, Long> getVoteResult(Long vsId) {
        MovieVsEntity vs = movieVSRepository.findById(vsId)
                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

        List<MovieVoteEntity> votes = movieVoteRepository.findByMovieVS(vs);

        return votes.stream()
                .collect(Collectors.groupingBy(v -> v.getMovie().getMovieIdx(), Collectors.counting()));
    }

    /**
     * ✅ 이번 주 기준 영화별 투표 수 집계
     */
    public Map<Long, Long> getWeeklyVoteCounts() {
        LocalDate now = LocalDate.now();
        LocalDate start = now.with(DayOfWeek.MONDAY);
        LocalDate end = now.with(DayOfWeek.SUNDAY);

        LocalDateTime startOfWeek = start.atStartOfDay();
        LocalDateTime endOfWeek = end.atTime(23, 59, 59);

        List<Object[]> results = movieVoteRepository.countVotesThisWeek(startOfWeek, endOfWeek);

        return results.stream()
                .collect(Collectors.toMap(
                        r -> (Long) r[0],  // movieId
                        r -> (Long) r[1]   // count
                ));
    }

    /**
     * ✅ 특정 영화 TMDB 기준 투표 수 조회
     */
    public long getVoteCountByTmdbId(Long tmdbMovieId) {
        return movieVoteRepository.countByMovie_TmdbMovieId(tmdbMovieId);
    }

    /**
     * ✅ DTO 변환 유틸
     */
    private MovieVoteDto toDto(MovieVoteEntity entity) {
        return MovieVoteDto.builder()
                .voteIdx(entity.getVoteIdx())
                .movieIdx(entity.getMovie().getMovieIdx())
                .vsIdx(entity.getMovieVS() != null ? entity.getMovieVS().getVsIdx() : null)
                .userId(entity.getUser().getUserId())
                .build();
    }
}
