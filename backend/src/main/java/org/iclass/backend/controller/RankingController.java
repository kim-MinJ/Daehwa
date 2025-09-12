package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.repository.MovieVoteRepository;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.service.MovieVoteService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/movie")
@RequiredArgsConstructor
public class RankingController {

    private final MovieVoteRepository movieVoteRepository;
    private final MovieVoteService movieVoteService;

    private String tmdbApiKey = "302b783e860b19b6822ef0a445e7ae53";
    private final RestTemplate restTemplate = new RestTemplate();

    /** ✅ TMDB 인기 영화 + 감독 + DB 투표 수 반영 */
    @GetMapping("/ranking")
public ResponseEntity<?> getPopularMovies() {
    try {
        String url = "https://api.themoviedb.org/3/movie/popular?api_key=" + tmdbApiKey + "&language=ko-KR&page=1";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        JSONObject json = new JSONObject(response.getBody());
        JSONArray results = json.getJSONArray("results");

        List<Map<String, Object>> movies = new ArrayList<>();
        for (int i = 0; i < results.length(); i++) {
            JSONObject m = results.getJSONObject(i);

            Long tmdbMovieId = m.getLong("id");

            // ✅ DB에서 실제 투표 수 가져오기
            long voteCount = movieVoteRepository.countByMovie_TmdbMovieId(tmdbMovieId);

            // ✅ TMDB에서 감독 가져오기
            String creditsUrl = String.format(
                "https://api.themoviedb.org/3/movie/%d/credits?api_key=%s&language=ko-KR",
                tmdbMovieId, tmdbApiKey
            );
            ResponseEntity<String> creditsRes = restTemplate.getForEntity(creditsUrl, String.class);
            JSONObject creditsJson = new JSONObject(creditsRes.getBody());
            JSONArray crew = creditsJson.getJSONArray("crew");

            String director = "알 수 없음";
            for (int j = 0; j < crew.length(); j++) {
                JSONObject person = crew.getJSONObject(j);
                if ("Director".equals(person.optString("job"))) {
                    director = person.optString("name", "알 수 없음");
                    break;
                }
            }

            Map<String, Object> movie = new HashMap<>();
            movie.put("movieIdx", tmdbMovieId);
            movie.put("tmdbMovieId", tmdbMovieId);
            movie.put("title", m.getString("title"));
            movie.put("posterPath", m.optString("poster_path", null));
            movie.put("year", m.optString("release_date", "0000-00-00"));
            movie.put("rating", m.getDouble("vote_average"));
            movie.put("overview", m.optString("overview", ""));
            movie.put("director", director);         // ✅ 감독 추가
            movie.put("voteCount", m.getInt("vote_count"));       // ✅ 실제 투표 수 반영

            movies.add(movie);
        }

        return ResponseEntity.ok(movies);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "TMDB API 호출 실패", "message", e.getMessage()));
    }
    }
}
