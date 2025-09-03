package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {
  List<MovieVoteEntity> findByMovieVS(MovieVsEntity movieVS);

    Long countByMovie(MovieInfoEntity movie);
}