package org.iclass.backend.loader;

import org.iclass.backend.service.save.GenresSave;
import org.iclass.backend.service.save.MovieInfoSave;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class DataLoader implements CommandLineRunner {

    private final MovieInfoSave movieInfoSave;
    private final GenresSave genresSave;

    @Override
    public void run(String... args) throws Exception {
        genresSave.fetchAndSaveGenres();         // Genres 저장
        movieInfoSave.fetchAndSaveAllPages();    // MovieInfo, MovieGenres 저장



        // DB 에 데이터 저장하고 싶으면 주석 풀기
    }
}