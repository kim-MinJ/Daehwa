package org.iclass.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.iclass.backend.Entity.*;
import org.iclass.backend.repository.*;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieVoteService {
    private final MovieVoteRepository voteRepository;
    private final MovieVSRepository vsRepository;
    private final MovieInfoRepository movieRepository;

    // 투표
    public MovieVoteEntity vote(Long vsIdx, Long movieIdx, UsersEntity user) {
        MovieVsEntity vs = vsRepository.findById(vsIdx)
                .orElseThrow(() -> new RuntimeException("VS not found"));
        MovieInfoEntity movie = movieRepository.findById(movieIdx)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        MovieVoteEntity vote = MovieVoteEntity.builder()
                .movieVS(vs)
                .movie(movie)
                .user(user)
                .build();

        return voteRepository.save(vote);
    }

    public Map<Long, Long> getBattleResult(Long vsIdx) {
    MovieVsEntity vs = vsRepository.findById(vsIdx)
            .orElseThrow(() -> new RuntimeException("VS not found"));

    List<MovieVoteEntity> votes = voteRepository.findByMovieVS(vs);

    long votes1 = votes.stream()
            .filter(v -> v.getMovie().getMovieIdx().equals(vs.getMovieVs1().getMovieIdx()))
            .count();

    long votes2 = votes.stream()
            .filter(v -> v.getMovie().getMovieIdx().equals(vs.getMovieVs2().getMovieIdx()))
            .count();

    Map<Long, Long> result = new HashMap<>();
    result.put(vs.getMovieVs1().getMovieIdx(), votes1);
    result.put(vs.getMovieVs2().getMovieIdx(), votes2);

    return result;
}
    public List<Map<String, Object>> getMovieRanking() {
    List<MovieInfoEntity> movies = movieRepository.findAll();

    return movies.stream()
            .map(movie -> {
                Long voteCount = voteRepository.countByMovie(movie);
                Map<String, Object> map = new HashMap<>();
                map.put("movieId", movie.getMovieIdx());
                map.put("title", movie.getTitle());
                map.put("posterPath", movie.getPosterPath());
                map.put("voteCount", voteCount);
                return map;
            })
            .sorted((m1, m2) -> Long.compare((Long) m2.get("voteCount"), (Long) m1.get("voteCount")))
            .toList();
}

}

