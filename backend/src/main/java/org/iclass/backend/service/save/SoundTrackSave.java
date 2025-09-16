package org.iclass.backend.service.save;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.SoundTrackEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.SoundTrackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

@Service
public class SoundTrackSave {

    private final SoundTrackRepository soundTrackRepository;
    private final MovieInfoRepository movieInfoRepository;
    private final String YOUTUBE_API_KEY = "AIzaSyD1rmIqvjUmHJ7mh1hvYPpOsFe0DxN1vUg";

    public SoundTrackSave(SoundTrackRepository soundTrackRepository,
                          MovieInfoRepository movieInfoRepository) {
        this.soundTrackRepository = soundTrackRepository;
        this.movieInfoRepository = movieInfoRepository;
    }

    /**
     * 모든 영화에 대해 YouTube 검색 후 OST 저장 (영화당 3~4개)
     */
    @Transactional
    public void saveOstsForAllMovies() {
        List<MovieInfoEntity> movies = movieInfoRepository.findAll();

        for (MovieInfoEntity movie : movies) {
            Long movieIdx = movie.getMovieIdx();

            // 이미 OST 저장되어 있는지 확인
            if (!soundTrackRepository.findByMovieInfo_MovieIdx(movieIdx).isEmpty()) {
                continue;
            }

            // YouTube API 검색 (4개 영상)
            List<YouTubeResult> results = searchYouTubeMultipleWithRetry(movie.getTitle() + " OST", 4);

            // 결과가 있으면 DB에 저장
            for (YouTubeResult r : results) {
                SoundTrackEntity ost = SoundTrackEntity.builder()
                        .movieInfo(movie)
                        .youtubeIdx(r.videoId())
                        .title(r.title())
                        .build();
                soundTrackRepository.save(ost);
            }
        }
    }

    /**
     * YouTube API 검색 + 재시도 + Rate 제한 적용
     */
    private List<YouTubeResult> searchYouTubeMultipleWithRetry(String query, int maxResults) {
        int attempts = 0;
        int maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                Thread.sleep(500L); // 요청 간 간격 조정 (Rate 제한 대응)
                String url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults="
                        + maxResults + "&q=" + UriUtils.encode(query, StandardCharsets.UTF_8)
                        + "&key=" + YOUTUBE_API_KEY;

                RestTemplate restTemplate = new RestTemplate();
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);

                if (response != null && response.containsKey("items")) {
                    List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
                    List<YouTubeResult> results = new ArrayList<>();
                    for (Map<String, Object> item : items) {
                        Map<String, Object> id = (Map<String, Object>) item.get("id");
                        Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                        results.add(new YouTubeResult(
                                (String) id.get("videoId"),
                                (String) snippet.get("title")
                        ));
                    }
                    return results;
                }
                return List.of();
            } catch (Exception e) {
                attempts++;
                System.out.println("YouTube 검색 오류: " + query + " / 시도 " + attempts + " / " + e.getMessage());
                try {
                    Thread.sleep(1000L * attempts); // 점진적 backoff
                } catch (InterruptedException ignored) {}
            }
        }
        return List.of(); // 재시도 후 실패 시 빈 리스트 반환
    }

    /**
     * DTO: YouTube 검색 결과
     */
    private record YouTubeResult(String videoId, String title) {}
}
