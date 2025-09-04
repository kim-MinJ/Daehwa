package org.iclass.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EnvVarLogger implements CommandLineRunner {

    @Value("${TMDB_API_KEY}")
    private String tmdbApiKey;

    @Value("${DB_URL}")
    private String dbUrl;

    @Value("${DB_USER}")
    private String dbUsername;

    @Value("${DB_PASS}")
    private String dbPassword;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=========================================");
        System.out.println("환경 변수 값 확인");
        System.out.println("TMDB API Key: " + tmdbApiKey);
        System.out.println("Database URL: " + dbUrl);
        System.out.println("Database Username: " + dbUsername);
        System.out.println("Database Password: " + dbPassword);
        System.out.println("=========================================");
    }
}