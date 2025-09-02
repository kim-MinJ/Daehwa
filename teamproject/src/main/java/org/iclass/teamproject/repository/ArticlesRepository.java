package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticlesRepository extends JpaRepository<ArticlesEntity, Long> {
  List<ArticlesEntity> findByMovie(MovieInfoEntity movie);
}