package org.iclass.backend.repository;

import org.iclass.backend.Entity.GenresEntity;
import org.iclass.backend.Entity.MovieGenresEntity;
import org.iclass.backend.Entity.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieGenresRepository extends JpaRepository<MovieGenresEntity, Long> {
  boolean existsByMovieAndGenre(MovieInfoEntity movie, GenresEntity genre);
}