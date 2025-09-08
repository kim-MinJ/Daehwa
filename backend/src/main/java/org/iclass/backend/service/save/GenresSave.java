package org.iclass.backend.service.save;

import org.iclass.backend.asdf.GenresEntity;
import org.iclass.backend.repository.GenresRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class GenresSave {

    private final GenresRepository genresRepository;
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWM5MGIzZDgzYzNlZTBjZmU5Y2ZiOTljYTA4ZjQyZSIsIm5iZiI6MTc1NjY4OTUxNi43ODcwMDAyLCJzdWIiOiI2OGI0ZjQ2Yzg0YWY0MWZiMTMyMDBiNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.av3Qh2B2Nkmv545z0YFIJpki3_6AeD_zhslr72_Xhp4";

    public GenresSave(GenresRepository genresRepository) {
        this.genresRepository = genresRepository;
    }

    @Transactional
    public void fetchAndSaveGenres() throws Exception {
        String url = "https://api.themoviedb.org/3/genre/movie/list?language=en";

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Authorization", API_KEY)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful())
                throw new RuntimeException("API 호출 실패: " + response);

            String jsonData = response.body().string();
            JsonNode rootNode = mapper.readTree(jsonData);
            JsonNode genresArray = rootNode.get("genres");

            for (JsonNode genreNode : genresArray) {
                Long genreId = genreNode.get("id").asLong();
                String name = genreNode.get("name").asText();

                genresRepository.findByGenreId(genreId)
                        .ifPresentOrElse(
                                entity -> {
                                    // 이미 존재하면 API 값으로 덮어쓰기
                                    entity.setName(name);
                                    genresRepository.save(entity);
                                },
                                () -> {
                                    // 없으면 새로 저장
                                    GenresEntity newEntity = GenresEntity.builder()
                                            .genreId(genreId)
                                            .name(name)
                                            .build();
                                    genresRepository.save(newEntity);
                                });
            }
        }
    }
}