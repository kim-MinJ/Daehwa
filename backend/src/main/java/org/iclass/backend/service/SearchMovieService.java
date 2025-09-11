package org.iclass.backend.service;

import java.util.List;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@ReadingConverter
@AllArgsConstructor
public class SearchMovieService {
    private final MovieInfoRepository repository;

    // 전체 영화 조회
    public List<MovieInfoEntity> getAllMovies() {
        return repository.findAll();
    }

    // 단일 영화 조회
    public MovieInfoEntity getMovieById(Long movieIdx) {
        return repository.findById(movieIdx).orElse(null);
    }

    // tmdbMovieId로 조회
    public MovieInfoEntity getMovieByTmdbId(Long tmdbMovieId) {
        return repository.findByTmdbMovieId(tmdbMovieId).orElse(null);
    }

    // 장르 이름으로 영화 조회 추가
    public List<MovieInfoEntity> getMoviesByGenre(String genreName) {
    return repository.findMoviesByGenreName(genreName);
}
}