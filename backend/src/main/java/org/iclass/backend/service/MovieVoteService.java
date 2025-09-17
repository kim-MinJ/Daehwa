package org.iclass.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    // ✅ 투표하기
    
        public MovieVoteDto vote(Long vsId, Long movieId, String userId) {
        MovieVsEntity vs = movieVSRepository.findById(vsId)
                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

        MovieInfoEntity movie = movieInfoRepository.findByTmdbMovieId(movieId)
        .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음: " + userId));

        // 🔒 중복 투표 방지
        movieVoteRepository.findByMovieVSAndUser(vs, user).ifPresent(v -> {
                throw new IllegalStateException("이미 투표한 유저입니다.");
        });

        MovieVoteEntity vote = new MovieVoteEntity();
        vote.setMovie(movie);
        vote.setMovieVS(vs);
        vote.setUser(user);

        // 투표 저장
        MovieVoteEntity saved = movieVoteRepository.save(vote);

// ✅ Movie_Info 테이블의 voteCount 증가
        Integer current = movie.getVoteCount();
        if (current == null) current = 0;

        movie.setVoteCount(current + 1);

        // ✅ 즉시 반영
        movieInfoRepository.saveAndFlush(movie);

        System.out.println("투표 저장됨: " + saved.getVoteIdx() +
                " | 누적 voteCount=" + movie.getVoteCount());

        // ✅ 별도 메서드로 vote_count 증가
        updateVoteCount(movieId);

        return MovieVoteDto.of(saved);
        }

        @Transactional
        public void updateVoteCount(Long movieId) {
        MovieInfoEntity movieInfoEntity = movieInfoRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

        
        System.out.println("vote_count 업데이트됨: " + movieInfoEntity.getVoteCount());
        }

    // ✅ 특정 VS의 투표 결과 조회
    public Map<Long, Long> getVoteResult(Long vsId) {
        MovieVsEntity vs = movieVSRepository.findById(vsId)
                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

        List<MovieVoteEntity> votes = movieVoteRepository.findByMovieVS(vs);

        return votes.stream()
                .collect(Collectors.groupingBy(v -> v.getMovie().getMovieIdx(), Collectors.counting()));
    }

    // ✅ 이번 주 기준 영화별 투표 수 집계
        public Map<Long, Long> getWeeklyVoteCounts() {
        LocalDate now = LocalDate.now();
        LocalDate start = now.with(DayOfWeek.MONDAY);
        LocalDate end = now.with(DayOfWeek.SUNDAY);

        LocalDateTime startOfWeek = start.atStartOfDay();
        LocalDateTime endOfWeek = end.atTime(23, 59, 59);

        List<Object[]> results = movieVoteRepository.countVotesThisWeek(startOfWeek, endOfWeek);

        return results.stream()
                .collect(Collectors.toMap(
                        r -> (Long) r[0],  // movieIdx
                        r -> (Long) r[1]   // vote count
                ));
        }

    private MovieVoteDto toDto(MovieVoteEntity entity) {
        return MovieVoteDto.builder()
                .voteIdx(entity.getVoteIdx())
                .movieIdx(entity.getMovie().getMovieIdx())
                .vsIdx(entity.getMovieVS().getVsIdx())
                .userId(entity.getUser().getUserId())
                .build();
    }

    // 이번 주 or 전체 투표 수 집계
    public long getVoteCountByTmdbId(Long tmdbMovieId) {
        return movieVoteRepository.countByMovie_TmdbMovieId(tmdbMovieId);
}

}
