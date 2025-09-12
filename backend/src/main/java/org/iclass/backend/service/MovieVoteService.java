package org.iclass.backend.service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.dto.MovieVsDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVoteRepository;
import org.iclass.backend.repository.MovieVSRepository;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieVoteService {

    private final MovieVoteRepository movieVoteRepository;
    private final MovieInfoRepository movieInfoRepository;
    private final MovieVSRepository movieVSRepository;
    private final UsersRepository usersRepository;

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    /** ✅ TMDB에서 영화 가져와 저장 */
    private MovieInfoEntity fetchFromTMDBAndSave(Long tmdbMovieId) {
        String url = String.format(
            "https://api.themoviedb.org/3/movie/%d?api_key=%s&language=ko-KR",
            tmdbMovieId, tmdbApiKey
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        MovieInfoEntity entity = MovieInfoEntity.builder()
                .tmdbMovieId(tmdbMovieId)
                .title((String) response.get("title"))
                .overview((String) response.get("overview"))
                .backdropPath((String) response.get("backdrop_path"))
                .posterPath((String) response.get("poster_path"))
                .popularity(((Number) response.get("popularity")).doubleValue())
                .voteAverage(((Number) response.get("vote_average")).doubleValue())
                .voteCount(((Number) response.get("vote_count")).intValue())
                .adult((Boolean) response.get("adult"))
                .releaseDate(response.get("release_date") != null
                        ? LocalDate.parse((String) response.get("release_date"))
                        : null)
                .build();

        return movieInfoRepository.save(entity);
    }

    /** ✅ 특정 VS에서 영화 투표 */
    public MovieVoteDto vote(Long vsId, Long tmdbMovieId, String userId) {
        MovieVsEntity vs = movieVSRepository.findById(vsId)
                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

        MovieInfoEntity movie = movieInfoRepository.findByTmdbMovieId(tmdbMovieId)
                .orElseGet(() -> fetchFromTMDBAndSave(tmdbMovieId));

        UsersEntity user = usersRepository.findById(userId)
        .orElseGet(() -> usersRepository.save(
            UsersEntity.builder()
                .userId(userId)
                .username(userId)              // 기본적으로 userId를 이름으로
                .password("default1234")       // NOT NULL 제약 때문에 기본 비번
                .role("user")
                .status(0)
                .build()
        ));
        
        // 중복 투표 방지
        movieVoteRepository.findByMovieVSAndUser(vs, user).ifPresent(v -> {
            throw new IllegalStateException("이미 투표한 유저입니다.");
        });

        MovieVoteEntity vote = MovieVoteEntity.builder()
                .movie(movie)
                .movieVS(vs)
                .user(user)
                .build();

        MovieVoteEntity saved = movieVoteRepository.save(vote);
        return MovieVoteDto.of(saved);
    }

    /** ✅ 특정 VS 통계 */
    public Map<Long, Map<String, Object>> getVoteStats(Long vsId) {
        MovieVsEntity vs = movieVSRepository.findById(vsId)
                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + vsId));

        List<MovieVoteEntity> votes = movieVoteRepository.findByMovieVS(vs);

        Map<Long, Long> voteCountMap = votes.stream()
                .collect(Collectors.groupingBy(v -> v.getMovie().getTmdbMovieId(), Collectors.counting()));

        long totalVotes = voteCountMap.values().stream().mapToLong(Long::longValue).sum();

        Map<Long, Map<String, Object>> result = new HashMap<>();
        for (Map.Entry<Long, Long> entry : voteCountMap.entrySet()) {
            long count = entry.getValue();
            int percentage = totalVotes > 0 ? (int) Math.round((double) count / totalVotes * 100) : 0;
            Map<String, Object> stats = new HashMap<>();
            stats.put("count", count);
            stats.put("percentage", percentage);
            result.put(entry.getKey(), stats);
        }

        return result;
    }

    /** ✅ 전체 VS + 영화 정보 조회 */
    public List<Map<String, Object>> getAllVsWithMovies() {
        List<MovieVsEntity> vsList = movieVSRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (MovieVsEntity vs : vsList) {
            MovieInfoEntity movie1 = vs.getMovieVs1();
            MovieInfoEntity movie2 = vs.getMovieVs2();

            Map<Long, Map<String, Object>> stats = getVoteStats(vs.getVsIdx());

            Map<String, Object> vsMap = new HashMap<>();
            vsMap.put("vs", MovieVsDto.of(vs));
            vsMap.put("movie1", MovieInfoDto.of(movie1));
            vsMap.put("movie2", MovieInfoDto.of(movie2));
            vsMap.put("stats", stats);

            result.add(vsMap);
        }
        return result;
    }
}
