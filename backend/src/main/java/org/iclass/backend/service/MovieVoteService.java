package org.iclass.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
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

        /**
         * ✅ 영화 투표 (VS 기준 1일 1회 제한)
         */
        public MovieVoteDto voteMovie(Long movieId, String userId, Long vsId) {
                // 유저 조회
                UsersEntity user = usersRepository.findByUserId(userId)
                                .orElseThrow(() -> new IllegalArgumentException("유저 없음: " + userId));

                // 영화 조회
                MovieInfoEntity movie = movieInfoRepository.findById(movieId)
                                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

                // VS 조회
                MovieVsEntity vs = movieVsRepository.findById(vsId)
                                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

                // 오늘 하루의 시작/끝 시간
                LocalDate today = LocalDate.now();
                LocalDateTime startOfDay = today.atStartOfDay();
                LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

                // **VS 단위 오늘 투표 확인**
                movieVoteRepository
                                .findTodayVoteByRoundAndPair(vs.getVsRound(), vs.getPair(), user, startOfDay, endOfDay)
                                .ifPresent(v -> {
                                        throw new IllegalStateException("오늘 벌써 이 투표에 참가했습니다! 감사합니다!");
                                });

                // 새 투표 생성
                MovieVoteEntity vote = MovieVoteEntity.builder()
                                .movie(movie)
                                .user(user)
                                .movieVS(vs)
                                .vsDate(LocalDateTime.now())
                                .build();

                MovieVoteEntity saved = movieVoteRepository.save(vote);

                // Movie_Info 테이블의 voteCount 증가
                Integer current = movie.getVoteCount();
                movie.setVoteCount((current == null ? 0 : current) + 1);
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
                                                r -> (Long) r[1] // 투표 수
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

        // ✅ DTO 변환
        private MovieVoteDto toDto(MovieVoteEntity entity) {
                return MovieVoteDto.builder()
                                .voteIdx(entity.getVoteIdx())
                                .movieIdx(entity.getMovie().getMovieIdx())
                                .userId(entity.getUser().getUserId())
                                .build();
        }
}