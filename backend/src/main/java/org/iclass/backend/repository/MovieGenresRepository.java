package org.iclass.backend.repository;

import org.iclass.backend.asdf.GenresEntity;
import org.iclass.backend.asdf.MovieGenresEntity;
import org.iclass.backend.asdf.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieGenresRepository extends JpaRepository<MovieGenresEntity, Long> {
  boolean existsByMovieAndGenre(MovieInfoEntity movie, GenresEntity genre);
}