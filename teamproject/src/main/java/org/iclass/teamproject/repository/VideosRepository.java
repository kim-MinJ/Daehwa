package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VideosRepository extends JpaRepository<VideosEntity, Long> {
  List<VideosEntity> findByMovie(MovieInfoEntity movie);
}
