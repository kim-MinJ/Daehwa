package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VideosRepository extends JpaRepository<VideosEntity, Long> {
  List<VideosEntity> findByMovie(MovieInfoEntity movie);
}
