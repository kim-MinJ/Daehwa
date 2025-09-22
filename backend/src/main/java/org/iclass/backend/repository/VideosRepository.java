package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.VideosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideosRepository extends JpaRepository<VideosEntity, Long> {
  List<VideosEntity> findByMovie(MovieInfoEntity movie);
  List<VideosEntity> findByMovie_MovieIdx(Long movieIdx);

}
