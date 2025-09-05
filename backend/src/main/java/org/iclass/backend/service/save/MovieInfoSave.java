package org.iclass.backend.service.save;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    private final String API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWM5MGIzZDgzYzNlZTBjZmU5Y2ZiOTljYTA4ZjQyZSIsIm5iZiI6MTc1NjY4OTUxNi43ODcwMDAyLCJzdWIiOiI2OGI0ZjQ2Yzg0YWY0MWZiMTMyMDBiNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.av3Qh2B2Nkmv545z0YFIJpki3_6AeD_zhslr72_Xhp4"; // 실제
                                                                                                                                                                                                                                                                                                  // 키로
                                                                                                                                                                                                                                                                                                  // 교체
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
            if (!response.isSuccessful()) {
                throw new RuntimeException("API 호출 실패: " + response);
            }

            String jsonData = response.body().string();
            MovieInfoResponse movieResponse = mapper.readValue(jsonData, MovieInfoResponse.class);
            saveMovies(movieResponse);
        }
    }

    @Transactional
    public void saveMovies(MovieInfoResponse response) {
        List<MovieInfoResponse.MovieInfoApiDto> movies = response.getResults();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Set<Long> processedTmdbIds = new HashSet<>(); // 중복 검사용 Set

        for (MovieInfoResponse.MovieInfoApiDto dto : movies) {
            if (dto.getTmdb_movie_id() == null)
                continue;

            // 이미 처리한 영화면 건너뜀
            if (processedTmdbIds.contains(dto.getTmdb_movie_id())) {
                continue;
            }

            processedTmdbIds.add(dto.getTmdb_movie_id());

            final LocalDate releaseDate = (dto.getRelease_date() != null && !dto.getRelease_date().isBlank())
                    ? LocalDate.parse(dto.getRelease_date(), formatter)
                    : null;

            // Movie UPSERT
            MovieInfoEntity movie = movieInfoRepository.findByTmdbMovieId(dto.getTmdb_movie_id())
                    .map(entity -> {
                        entity.setTitle(dto.getTitle());
                        entity.setPopularity(dto.getPopularity() != null ? dto.getPopularity() : 0.0);
                        entity.setVoteCount(dto.getVote_count() != null ? dto.getVote_count() : 0);
                        entity.setVoteAverage(dto.getVote_average() != null ? dto.getVote_average() : 0.0);
                        entity.setAdult(dto.getAdult() != null ? dto.getAdult() : false);
                        entity.setOverview(dto.getOverview());
                        entity.setBackdropPath(dto.getBackdrop_path());
                        entity.setPosterPath(dto.getPoster_path());
                        entity.setReleaseDate(releaseDate);
                        return movieInfoRepository.save(entity);
                    })
                    .orElseGet(() -> {
                        MovieInfoEntity newMovie = MovieInfoEntity.builder()
                                .tmdbMovieId(dto.getTmdb_movie_id())
                                .title(dto.getTitle())
                                .popularity(dto.getPopularity() != null ? dto.getPopularity() : 0.0)
                                .voteCount(dto.getVote_count() != null ? dto.getVote_count() : 0)
                                .voteAverage(dto.getVote_average() != null ? dto.getVote_average() : 0.0)
                                .adult(dto.getAdult() != null ? dto.getAdult() : false)
                                .overview(dto.getOverview())
                                .backdropPath(dto.getBackdrop_path())
                                .posterPath(dto.getPoster_path())
                                .releaseDate(releaseDate)
                                .build();
                        return movieInfoRepository.save(newMovie);
                    });

            // MovieGenres 저장 (중복 방지)
            List<Long> genreIds = dto.getGenre_ids();
            if (genreIds != null) {
                for (Long genreId : genreIds) {
                    genresRepository.findByGenreId(genreId).ifPresent(genreEntity -> {
                        boolean exists = movieGenresRepository.existsByMovieAndGenre(movie, genreEntity);
                        if (!exists) {
                            MovieGenresEntity mg = MovieGenresEntity.builder()
                                    .movie(movie)
                                    .genre(genreEntity)
                                    .build();
                            movieGenresRepository.save(mg);
                        }
                    });
                }
            }
        }
    }
}
