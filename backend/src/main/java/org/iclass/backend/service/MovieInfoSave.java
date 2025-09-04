package org.iclass.backend.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.iclass.backend.Entity.GenresEntity;
import org.iclass.backend.Entity.MovieGenresEntity;
import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.repository.GenresRepository;
import org.iclass.backend.repository.MovieGenresRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.response.MovieInfoResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class MovieInfoSave {

    private final MovieInfoRepository movieInfoRepository;
    private final MovieGenresRepository movieGenresRepository;
    private final GenresRepository genresRepository;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWM5MGIzZDgzYzNlZTBjZmU5Y2ZiOTljYTA4ZjQyZSIsIm5iZiI6MTc1NjY4OTUxNi43ODcwMDAyLCJzdWIiOiI2OGI0ZjQ2Yzg0YWY0MWZiMTMyMDBiNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.av3Qh2B2Nkmv545z0YFIJpki3_6AeD_zhslr72_Xhp4";

    private final int TOTAL_PAGE = 224; 

    public MovieInfoSave(MovieInfoRepository movieInfoRepository,
                         MovieGenresRepository movieGenresRepository,
                         GenresRepository genresRepository) {
        this.movieInfoRepository = movieInfoRepository;
        this.movieGenresRepository = movieGenresRepository;
        this.genresRepository = genresRepository;
    }

    @Transactional
    public void fetchAndSaveAllPages() throws Exception {
        for (int page = 1; page <= TOTAL_PAGE; page++) {
            fetchAndSaveMovies(page);
        }
    }

    @Transactional
    public void fetchAndSaveMovies(int page) throws Exception {
        String url = "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=" + page;

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
            MovieInfoResponse movieResponse = mapper.readValue(jsonData, MovieInfoResponse.class);

            saveMovies(movieResponse);
        }
    }

    @Transactional
    public void saveMovies(MovieInfoResponse response) {
        List<MovieInfoResponse.MovieInfoApiDto> movies = response.getResults();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (MovieInfoResponse.MovieInfoApiDto dto : movies) {
            MovieInfoEntity movie = MovieInfoEntity.builder()
                    .tmdbMovieId(dto.getTmdb_movie_id())
                    .title(dto.getTitle())
                    .popularity(dto.getPopularity() != null ? dto.getPopularity() : 0.0)
                    .voteCount(dto.getVote_count() != null ? dto.getVote_count() : 0)
                    .voteAverage(dto.getVote_average() != null ? dto.getVote_average() : 0.0)
                    .adult(dto.getAdult() != null ? dto.getAdult() : 0)
                    .overview(dto.getOverview())
                    .backdropPath(dto.getBackdrop_path())
                    .posterPath(dto.getPoster_path())
                    .releaseDate(dto.getRelease_date() != null ? LocalDate.parse(dto.getRelease_date(), formatter) : null)
                    .build();

            movieInfoRepository.save(movie);

            List<Long> genreIds = dto.getGenre_ids();
            if (genreIds != null) {
                for (Long genreId : genreIds) {
                    GenresEntity genreEntity = genresRepository.findByGenreId(genreId);
                    if (genreEntity != null) {
                        MovieGenresEntity mg = MovieGenresEntity.builder()
                                .movie(movie)
                                .genre(genreEntity)
                                .build();
                        movieGenresRepository.save(mg);
                    }
                }
            }
        }
    }
}
