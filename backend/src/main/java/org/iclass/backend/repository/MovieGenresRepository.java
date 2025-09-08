package org.iclass.backend.repository;

import org.iclass.backend.entity.GenresEntity;
import org.iclass.backend.entity.MovieGenresEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieGenresRepository extends JpaRepository<MovieGenresEntity, Long> {
  boolean existsByMovieAndGenre(MovieInfoEntity movie, GenresEntity genre);
}