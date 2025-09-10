package org.iclass.backend.service.save;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.iclass.backend.entity.MovieCastEntity;
import org.iclass.backend.entity.MovieCrewEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieCastRepository;
import org.iclass.backend.repository.MovieCrewRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.response.MovieCreditResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class MovieCreditSave {

    private final MovieCastRepository castRepository;
    private final MovieCrewRepository crewRepository;
    private final MovieInfoRepository movieInfoRepository;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWM5MGIzZDgzYzNlZTBjZmU5Y2ZiOTljYTA4ZjQyZSIsIm5iZiI6MTc1NjY4OTUxNi43ODcwMDAyLCJzdWIiOiI2OGI0ZjQ2Yzg0YWY0MWZiMTMyMDBiNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.av3Qh2B2Nkmv545z0YFIJpki3_6AeD_zhslr72_Xhp4";

    public MovieCreditSave(MovieCastRepository castRepository,
                           MovieCrewRepository crewRepository,
                           MovieInfoRepository movieInfoRepository) {
        this.castRepository = castRepository;
        this.crewRepository = crewRepository;
        this.movieInfoRepository = movieInfoRepository;
    }

    @Transactional
    public void fetchAndSaveAllCredits() throws IOException {
        List<MovieInfoEntity> movies = movieInfoRepository.findAll();

        List<MovieCastEntity> allCastEntities = new ArrayList<>();
        List<MovieCrewEntity> allCrewEntities = new ArrayList<>();

        Set<Long> processedCastIds = new HashSet<>();
        Set<Long> processedCrewIds = new HashSet<>();

        for (MovieInfoEntity movie : movies) {
            Long tmdbMovieId = movie.getTmdbMovieId();
            if (tmdbMovieId == null) continue;

            String url = "https://api.themoviedb.org/3/movie/" + tmdbMovieId + "/credits?language=ko-KR";

            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .addHeader("accept", "application/json")
                    .addHeader("Authorization", API_KEY)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.err.println("API 호출 실패: " + response);
                    continue;
                }

                String jsonData = response.body().string();

                MovieCreditResponse creditResponse;
                try {
                    creditResponse = mapper.readValue(jsonData, MovieCreditResponse.class);

                    
                } catch (Exception e) {
                    System.err.println("JSON 파싱 오류: " + e.getMessage());
                    e.printStackTrace();
                    continue;
                }

                creditResponse.getCast().stream()
                        .filter(c -> c.getTmdbCastId() != null && !processedCastIds.contains(c.getTmdbCastId()))
                        .peek(c -> processedCastIds.add(c.getTmdbCastId()))
                        .forEach(c -> {
                            
                            MovieCastEntity entity = MovieCastEntity.builder()
                                    .tmdbMovieId(tmdbMovieId)
                                    .tmdbCastId(c.getTmdbCastId())
                                    .character(c.getCharacter())
                                    .castName(c.getName())
                                    .castProfilePath(c.getProfilePath())
                                    .creditOrder(c.getCreditOrder())
                                    .build();
                            allCastEntities.add(entity);
                        });

                creditResponse.getCrew().stream()
                        .filter(c -> "Director".contains(c.getJob()))
                        .filter(c -> c.getTmdbCrewId() != null && !processedCrewIds.contains(c.getTmdbCrewId()))
                        .peek(c -> processedCrewIds.add(c.getTmdbCrewId()))
                        .forEach(c -> {
                            MovieCrewEntity entity = MovieCrewEntity.builder()
                                    .tmdbMovieId(tmdbMovieId)
                                    .tmdbCrewId(c.getTmdbCrewId())
                                    .crewName(c.getName())
                                    .crewProfilePath(c.getProfilePath())
                                    .job(c.getJob())
                                    .build();
                            allCrewEntities.add(entity);
                        });

            } catch (Exception e) {
                System.err.println("요청 실패: " + e.getMessage());
                e.printStackTrace();
            }
        }

        try {
            System.out.println("총 저장할 캐스트 수: " + allCastEntities.size());
            System.out.println("총 저장할 크루 수: " + allCrewEntities.size());
            castRepository.saveAll(allCastEntities);
            crewRepository.saveAll(allCrewEntities);
            System.out.println("DB 저장 성공");
        } catch (Exception e) {
            System.err.println("DB 저장 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
