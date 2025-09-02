package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieGenresRepository extends JpaRepository<MovieGenresEntity, Long> {
  List<MovieGenresEntity> findByMovie(MovieInfoEntity movie);
}