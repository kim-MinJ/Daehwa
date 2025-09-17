package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.repository.MovieVoteRepository;
import org.iclass.backend.repository.MovieInfoRepository;
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
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class RankingController {

    private final MovieVoteRepository movieVoteRepository;
    private final MovieVoteService movieVoteService;
    private final MovieInfoRepository movieInfoRepository;

    private String tmdbApiKey = "302b783e860b19b6822ef0a445e7ae53";
    private final RestTemplate restTemplate = new RestTemplate();

    /** ✅ TMDB 인기 영화 + 감독 + DB 투표 수 합산 */
    @GetMapping("/trending")
    public ResponseEntity<?> getPopularMovies() {
        try {
            String url = "https://api.themoviedb.org/3/movie/popular?api_key=" + tmdbApiKey + "&language=ko-KR&page=1";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            JSONObject json = new JSONObject(response.getBody());
            JSONArray results = json.getJSONArray("results");

            List<Map<String, Object>> movies = new ArrayList<>();
            for (int i = 0; i < results.length(); i++) {
                JSONObject m = results.getJSONObject(i);

                Long tmdbMovieId = m.getLong("id");   // ✅ TMDB에서 영화 ID는 "id"

                // ✅ DB에서 우리 시스템에 저장된 영화 엔티티 가져오기
                MovieInfoEntity movieInfoEntity = movieInfoRepository.findByTmdbMovieId(tmdbMovieId).orElse(null);

                int tmdbVoteCount = m.optInt("vote_count", 0);
                int localVoteCount = (movieInfoEntity != null && movieInfoEntity.getVoteCount() != null)
                        ? movieInfoEntity.getVoteCount()
                        : 0;

                // ✅ 합산 값
                int totalVoteCount = tmdbVoteCount + localVoteCount;

                // ✅ TMDB에서 감독 가져오기
                String creditsUrl = String.format(
                        "https://api.themoviedb.org/3/movie/%d/credits?api_key=%s&language=ko-KR",
                        tmdbMovieId, tmdbApiKey);
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

                // ✅ 응답 데이터 구성
                Optional<MovieInfoEntity> movieEntityOpt = movieInfoRepository.findByTmdbMovieId(tmdbMovieId);

                Map<String, Object> movie = new HashMap<>();
                movieEntityOpt.ifPresent(entity -> movie.put("movieIdx", entity.getMovieIdx()));  // DB PK 저장
                movie.put("tmdbMovieId", tmdbMovieId);
                movie.put("title", m.getString("title"));
                movie.put("posterPath", m.optString("poster_path", null));
                movie.put("year", m.optString("release_date", "0000-00-00"));
                movie.put("rating", m.getDouble("vote_average"));
                movie.put("overview", m.optString("overview", ""));
                movie.put("director", director);
                // ✅ TMDB의 장르 ID 배열 -> 장르 이름 변환
                List<String> genreNames = new ArrayList<>();
                if (m.has("genre_ids")) {
                    JSONArray genreIds = m.getJSONArray("genre_ids");
                    for (int g = 0; g < genreIds.length(); g++) {
                        int genreId = genreIds.getInt(g);
                        genreNames.add(mapGenreIdToName(genreId)); // 밑에 메서드 추가
                    }
                }
                movie.put("genres", genreNames);
                movie.put("tmdbVoteCount", m.getInt("vote_count"));

                // ✅ 투표수: 합산 값
                movie.put("voteCount", totalVoteCount);

                // 참고: 원본 값도 보관
                movie.put("tmdbVoteCount", tmdbVoteCount);
                movie.put("localVoteCount", localVoteCount);

                movies.add(movie);
            }
                movies.sort((a, b) -> Double.compare(
                (Double) b.get("rating"),
                (Double) a.get("rating")
        )); 

        // ✅ 상위 2개만 반환 (대결용)
        List<Map<String, Object>> top2 = movies.subList(0, Math.min(2, movies.size()));

        return ResponseEntity.ok(movies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "TMDB API 호출 실패", "message", e.getMessage()));
        }
        
    }
    private String mapGenreIdToName(int genreId) {
    switch (genreId) {
        case 28: return "Action";
        case 12: return "Adventure";
        case 16: return "Animation";
        case 35: return "Comedy";
        case 80: return "Crime";
        case 99: return "Documentary";
        case 18: return "Drama";
        case 10751: return "Family";
        case 14: return "Fantasy";
        case 36: return "History";
        case 27: return "Horror";
        case 10402: return "Music";
        case 9648: return "Mystery";
        case 10749: return "Romance";
        case 878: return "Science Fiction";
        case 10770: return "TV Movie";
        case 53: return "Thriller";
        case 10752: return "War";
        case 37: return "Western";
        default: return "Unknown";
    }
}
}
