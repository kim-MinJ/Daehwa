package org.iclass.backend.service.save;

import static java.util.Map.entry;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.iclass.backend.entity.FeelingGenreEntity;
import org.iclass.backend.entity.MovieGenresEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.FeelingGenreRepository;
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
    private final FeelingGenreRepository feelingGenreRepository;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWM5MGIzZDgzYzNlZTBjZmU5Y2ZiOTljYTA4ZjQyZSIsIm5iZiI6MTc1NjY4OTUxNi43ODcwMDAyLCJzdWIiOiI2OGI0ZjQ2Yzg0YWY0MWZiMTMyMDBiNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.av3Qh2B2Nkmv545z0YFIJpki3_6AeD_zhslr72_Xhp4"; // 실제
                                                                                                                                                                                                                                                                                                  // 키로
                                                                                                                                                                                                                                                                                                  // 교체
    private final int TOTAL_PAGE = 100; // 224

    private static final Map<String, String[]> genreToFeelingMap = Map.ofEntries(
            entry("액션", new String[] { "화남", "긴장됨", "놀람", "짜릿함", "흥분됨" }),
            entry("어드벤처", new String[] { "심심함", "설렘", "긴장됨", "흥분됨", "즐거움" }),
            entry("애니메이션", new String[] { "기쁨", "편안함", "즐거움", "설렘", "심심함" }),
            entry("코미디", new String[] { "기쁨", "편안함", "심심함", "즐거움", "설렘" }),
            entry("범죄", new String[] { "화남", "긴장됨", "심심함", "놀람", "짜릿함" }),
            entry("다큐멘터리", new String[] { "슬픔", "피곤함", "감동적임", "편안함", "생각남" }),
            entry("드라마", new String[] { "슬픔", "기쁨", "편안함", "감동적임", "설렘" }),
            entry("가족", new String[] { "기쁨", "편안함", "감동적임", "즐거움", "설렘" }),
            entry("판타지", new String[] { "슬픔", "편안함", "흥분됨", "설렘", "놀람" }),
            entry("역사", new String[] { "피곤함", "감동적임", "슬픔", "생각남", "설렘" }),
            entry("공포", new String[] { "긴장됨", "놀람", "짜릿함", "화남", "심심함" }),
            entry("음악", new String[] { "기쁨", "설렘", "편안함", "즐거움", "감동적임" }),
            entry("미스터리", new String[] { "긴장됨", "놀람", "심심함", "짜릿함", "화남" }),
            entry("로맨스", new String[] { "기쁨", "설렘", "슬픔", "편안함", "감동적임" }),
            entry("SF", new String[] { "심심함", "흥분됨", "놀람", "설렘", "짜릿함" }),
            entry("TV 영화", new String[] { "편안함", "심심함", "즐거움", "설렘", "감동임" }),
            entry("스릴러", new String[] { "긴장됨", "놀람", "화남", "짜릿함", "심심함" }),
            entry("전쟁", new String[] { "화남", "긴장됨", "짜릿함", "슬픔", "감동적임" }),
            entry("서부극", new String[] { "흥분됨", "짜릿함", "화남", "놀람", "심심함" }));

    public MovieInfoSave(MovieInfoRepository movieInfoRepository,
            MovieGenresRepository movieGenresRepository,
            GenresRepository genresRepository, FeelingGenreRepository feelingGenreRepository) {
        this.movieInfoRepository = movieInfoRepository;
        this.movieGenresRepository = movieGenresRepository;
        this.genresRepository = genresRepository;
        this.feelingGenreRepository = feelingGenreRepository;
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
                        String genreName = genreEntity.getName();
                        String[] feelings = genreToFeelingMap.get(genreName);

                        if (feelings != null) {
                            for (String feeling : feelings) {
                                boolean fgExists = feelingGenreRepository
                                        .existsByFeelingTypeAndGenreAndMovie(feeling, genreEntity, movie);

                                if (!fgExists) {
                                    FeelingGenreEntity fg = FeelingGenreEntity.builder()
                                            .feelingType(feeling)
                                            .genre(genreEntity)
                                            .movie(movie)
                                            .build();
                                    feelingGenreRepository.save(fg);
                                    System.out.println("저장됨: 영화=" + movie.getTitle()
                                            + " / 장르=" + genreName
                                            + " / 감정=" + feeling);
                                }
                            }
                        }
                    });
                }
            }
        }
    }
}
