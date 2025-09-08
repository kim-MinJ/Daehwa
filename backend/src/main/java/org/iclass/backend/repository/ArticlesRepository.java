package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.asdf.ArticlesEntity;
import org.iclass.backend.asdf.MovieInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticlesRepository extends JpaRepository<ArticlesEntity, Long> {
  List<ArticlesEntity> findByMovie(MovieInfoEntity movie);
}