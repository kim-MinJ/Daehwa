package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.entity.MovieCrewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieCrewRepository extends JpaRepository<MovieCrewEntity, Long> {

    // TMDB 영화 ID로 크루 리스트 조회
    List<MovieCrewEntity> findByTmdbMovieId(Long tmdbMovieId);

    // TMDB 크루 ID로 조회
    List<MovieCrewEntity> findByTmdbCrewId(Long tmdbCrewId);

    // 특정 영화 + 크루 조회
    List<MovieCrewEntity> findByTmdbMovieIdAndTmdbCrewId(Long tmdbMovieId, Long tmdbCrewId);

    // 특정 영화에서 직무(Job)로 조회
    List<MovieCrewEntity> findByTmdbMovieIdAndJob(Long tmdbMovieId, String job);
}
