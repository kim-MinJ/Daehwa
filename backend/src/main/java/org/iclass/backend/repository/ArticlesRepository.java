package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticlesRepository extends JpaRepository<ArticlesEntity, Long> {
  List<ArticlesEntity> findByMovie(MovieInfoEntity movie);
}