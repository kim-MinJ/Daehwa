package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.entity.MovieCastEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieCastRepository extends JpaRepository<MovieCastEntity, Long> {

    // TMDB 영화 ID로 배우 리스트 조회
    List<MovieCastEntity> findByTmdbMovieId(Long tmdbMovieId);

    // TMDB 캐스트 ID로 조회
    List<MovieCastEntity> findByTmdbCastId(Long tmdbCastId);

    // 특정 영화 + 캐스트 조회
    List<MovieCastEntity> findByTmdbMovieIdAndTmdbCastId(Long tmdbMovieId, Long tmdbCastId);
}