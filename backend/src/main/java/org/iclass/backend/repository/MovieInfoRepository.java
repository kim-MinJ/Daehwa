package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.entity.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
    Optional<MovieInfoEntity> findByTmdbMovieId(Long tmdbMovieId);

    @Query(value = "SELECT * FROM MOVIE_INFO ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 1 ROWS ONLY", nativeQuery = true)
    MovieInfoEntity findRandomMovie();
}