package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.asdf.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
    Optional<MovieInfoEntity> findByTmdbMovieId(Long tmdbMovieId);
}