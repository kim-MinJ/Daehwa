package org.iclass.backend.loader;

import org.iclass.backend.service.GenresSave;
import org.iclass.backend.service.MovieInfoSave;
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
        genresSave.fetchAndSaveGenres();
        movieInfoSave.fetchAndSaveAllPages();
    }
}