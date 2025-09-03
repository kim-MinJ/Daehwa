package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieCreditsRepository extends JpaRepository<MovieCreditsEntity, Long> {
  List<MovieCreditsEntity> findByMovie(MovieInfoEntity movie);
}