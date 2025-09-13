package org.iclass.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.iclass.backend.dto.MovieInfoDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieInfoRepository movieInfoRepository;

    // TMDB API 연동을 위한 정보 (MoviesService.java에서 가져옴)
    private final String API_KEY = "302b783e860b19b6822ef0a445e7ae53";

    public MovieInfoDto getMovie(Long id) {
        MovieInfoEntity entity = movieInfoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
        return MovieInfoDto.of(entity);
    }

    public MovieInfoDto getMovieByTmdbId(Long tmdbId) {
        MovieInfoEntity entity = movieInfoRepository.findByTmdbMovieId(tmdbId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
        return MovieInfoDto.of(entity);
    }

    /**
     * 비슷한 영화 목록을 가져오는 기능 (추가된 부분)
     * 
     * @param id 영화의 DB ID
     * @return 비슷한 영화 DTO 목록
     */
    public List<MovieInfoDto> findSimilar(Long id) {
        // 1. DB에서 id로 영화를 찾아 TMDB ID를 얻습니다.
        MovieInfoEntity movie = movieInfoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
        Long tmdbId = movie.getTmdbMovieId();

        // 2. TMDB API를 호출하여 비슷한 영화 목록을 가져옵니다.
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = String.format("https://api.themoviedb.org/3/movie/%d/similar?language=ko-KR&page=1&api_key=%s",
                tmdbId, API_KEY);

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);
            Map<String, Object> body = response.getBody();

            if (body != null && body.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");

                // 3. 반환된 영화 목록을 우리 DB에 있는 영화와 매칭하여 DTO 리스트로 변환합니다.
                return results.stream()
                        .map(movieData -> ((Number) movieData.get("id")).longValue()) // TMDB ID 추출
                        .map(movieInfoRepository::findByTmdbMovieId) // DB에서 해당 TMDB ID로 영화 검색
                        .filter(Optional::isPresent) // DB에 존재하는 영화만 필터링
                        .map(Optional::get)
                        .map(MovieInfoDto::of) // MovieDto로 변환
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            // API 호출 실패 시 로깅을 추가할 수 있습니다.
            System.err.println("Error fetching similar movies: " + e.getMessage());
        }

        return Collections.emptyList(); // 결과가 없거나 오류 발생 시 빈 리스트 반환
    }
}