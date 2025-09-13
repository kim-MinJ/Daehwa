package org.iclass.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class backendApplication implements CommandLineRunner {

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    public static void main(String[] args) {
        SpringApplication.run(backendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("TMDB API KEY = " + tmdbApiKey);
    }
}
