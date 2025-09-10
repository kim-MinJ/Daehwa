package org.iclass.backend.service.save;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.VideosEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.VideosRepository;
import org.iclass.backend.response.MovieVideoResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class MovieVideoSave {

    private final MovieInfoRepository movieInfoRepository;
    private final VideosRepository videosRepository;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWM5MGIzZDgzYzNlZTBjZmU5Y2ZiOTljYTA4ZjQyZSIsIm5iZiI6MTc1NjY4OTUxNi43ODcwMDAyLCJzdWIiOiI2OGI0ZjQ2Yzg0YWY0MWZiMTMyMDBiNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.av3Qh2B2Nkmv545z0YFIJpki3_6AeD_zhslr72_Xhp4"; // 실제 키로 교체

    public MovieVideoSave(MovieInfoRepository movieInfoRepository,
                          VideosRepository videosRepository) {
        this.movieInfoRepository = movieInfoRepository;
        this.videosRepository = videosRepository;
    }

    @Transactional
    public void fetchAndSaveAllVideos() throws IOException {
        // DB에 저장된 모든 영화 조회
        List<MovieInfoEntity> movies = movieInfoRepository.findAll();
        List<VideosEntity> videoEntities = new ArrayList<>();

        for (MovieInfoEntity movie : movies) {
            Long tmdbMovieId = movie.getTmdbMovieId();
            if (tmdbMovieId == null) continue;

            // Open API 호출
            String url = "https://api.themoviedb.org/3/movie/" + tmdbMovieId + "/videos?language=ko-KR";
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .addHeader("accept", "application/json")
                    .addHeader("Authorization", API_KEY)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.out.println("API 호출 실패: " + tmdbMovieId);
                    continue;
                }

                String jsonData = response.body().string();
                MovieVideoResponse videoResponse = mapper.readValue(jsonData, MovieVideoResponse.class);

                // DTO → Entity 변환 후 리스트에 추가
                if (videoResponse.getResults() != null) {
                    for (MovieVideoResponse.VideoDto dto : videoResponse.getResults()) {
                        videoEntities.add(dto.toEntity(movie));
                    }
                }
            }
        }

        // 모든 영상 DB에 한 번에 저장
        if (!videoEntities.isEmpty()) {
            videosRepository.saveAll(videoEntities);
        }
    }
}