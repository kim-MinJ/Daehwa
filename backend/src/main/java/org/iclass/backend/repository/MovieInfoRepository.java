package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.Entity.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
    Optional<MovieInfoEntity> findByTmdbMovieId(Long tmdbMovieId);
}