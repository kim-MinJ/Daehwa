package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.asdf.MovieInfoEntity;
import org.iclass.backend.asdf.VideosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideosRepository extends JpaRepository<VideosEntity, Long> {
  List<VideosEntity> findByMovie(MovieInfoEntity movie);
}
