package org.iclass.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/movie")
public class RankingController {

    
    private String tmdbApiKey = "302b783e860b19b6822ef0a445e7ae53" ;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping ("/ranking")
    public ResponseEntity<?> getPopularMovies() {
    try {
        String url = "https://api.themoviedb.org/3/movie/popular?api_key=" + tmdbApiKey + "&language=ko-KR&page=1";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        JSONObject json = new JSONObject(response.getBody());
        JSONArray results = json.getJSONArray("results");

        List<Map<String, Object>> movies = new ArrayList<>();
        for (int i = 0; i < results.length(); i++) {
            JSONObject m = results.getJSONObject(i);
            Map<String, Object> movie = new HashMap<>();
            movie.put("id", m.get("id").toString());
            movie.put("title", m.getString("title"));
            movie.put("director", "");
            String posterPath = m.optString("poster_path", null);
                if (posterPath != null && !posterPath.isEmpty()) {
             movie.put("poster", "https://image.tmdb.org/t/p/w500" + posterPath);  
            } else {
             movie.put("poster", "https://via.placeholder.com/500x750?text=No+Image");
        }
            String releaseDate = m.optString("release_date", "0000-00-00");
            movie.put("year", releaseDate.length() >= 4 ? releaseDate.substring(0, 4) : "N/A");
            movie.put("genre", "/movie/{movie_id}/credits");
            movie.put("rating", m.getDouble("vote_average"));
            movie.put("runtime", 0);
            movie.put("description", m.optString("overview", ""));
            movies.add(movie);

            
        }
        return ResponseEntity.ok(movies);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "TMDB API 호출 실패", "message", e.getMessage()));
    }
    }
}

