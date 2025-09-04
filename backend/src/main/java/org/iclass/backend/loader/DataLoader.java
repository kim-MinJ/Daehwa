package org.iclass.backend.loader;

import org.iclass.backend.service.GenresSave;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final GenresSave genresSave;

    public DataLoader(GenresSave genresSave) {
        this.genresSave = genresSave;
    }

    @Override
    public void run(String... args) throws Exception {
        genresSave.fetchAndSaveGenres();
    }
}