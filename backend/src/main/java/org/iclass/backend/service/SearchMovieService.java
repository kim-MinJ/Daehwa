package org.iclass.backend.service;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SearchMovieService {

    private final MovieInfoRepository repository;

    // 전체 영화 조회 + 페이징
    public Page<MovieInfoEntity> getAllMovies(Pageable pageable) {
        return repository.findAll(pageable);
    }

    // 단일 영화 조회
    public MovieInfoEntity getMovieBymovieIdx(Long movieIdx) {
        return repository.findById(movieIdx).orElse(null);
    }

    // tmdbMovieId로 조회
    public MovieInfoEntity getMovieByTmdbId(Long tmdbMovieId) {
        return repository.findByTmdbMovieId(tmdbMovieId).orElse(null);
    }

    // 장르 이름으로 영화 조회 + 페이징
    public Page<MovieInfoEntity> getMoviesByGenre(String genreName, Pageable pageable) {
        return repository.findMoviesByGenreName(genreName, pageable);
    }

    // 제목 검색 + 페이징
    public Page<MovieInfoEntity> searchMoviesByTitle(String query, Pageable pageable) {
        return repository.findByTitleContainingIgnoreCase(query, pageable);
    }
}
