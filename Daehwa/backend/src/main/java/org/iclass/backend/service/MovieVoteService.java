package org.iclass.backend.service;

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

        // 투표하기
        public MovieVoteDto vote(Long vsId, Long movieId, String userId) {
                MovieVsEntity vs = movieVSRepository.findById(vsId)
                                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

                MovieInfoEntity movie = movieInfoRepository.findById(movieId)
                                .orElseThrow(() -> new IllegalArgumentException("영화 없음: " + movieId));

                UsersEntity user = usersRepository.findById(userId)
                                .orElseThrow(() -> new IllegalArgumentException("유저 없음: " + userId));

                // 🔒 중복 투표 방지 로직
                movieVoteRepository.findByMovieVSAndUser(vs, user).ifPresent(v -> {
                        throw new IllegalStateException("이미 투표한 유저입니다.");
                });

                MovieVoteEntity vote = new MovieVoteEntity();
                vote.setMovie(movie);
                vote.setMovieVS(vs);
                vote.setUser(user);

                MovieVoteEntity saved = movieVoteRepository.save(vote);

                return toDto(saved);
        }

        // 특정 VS의 투표 결과 조회
        public Map<Long, Long> getVoteResult(Long vsId) {
                MovieVsEntity vs = movieVSRepository.findById(vsId)
                                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

                List<MovieVoteEntity> votes = movieVoteRepository.findByMovieVS(vs);

                // 영화별 투표 수 집계
                return votes.stream()
                                .collect(Collectors.groupingBy(v -> v.getMovie().getMovieIdx(), Collectors.counting()));
        }

        private MovieVoteDto toDto(MovieVoteEntity entity) {
                return MovieVoteDto.builder()
                                .voteIdx(entity.getVoteIdx())
                                .movieIdx(entity.getMovie().getMovieIdx())
                                .vsIdx(entity.getMovieVS().getVsIdx())
                                .userId(entity.getUser().getUserId()) // String 타입
                                .build();
        }
}
