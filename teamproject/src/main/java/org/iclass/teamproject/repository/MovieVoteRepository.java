package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {
  List<MovieVoteEntity> findByMovieVS(MovieVsEntity movieVS);
}