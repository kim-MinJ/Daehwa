package org.iclass.backend.repository;

import org.iclass.backend.Entity.MovieVoteEntity;
import org.iclass.backend.Entity.MovieVsEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {
  List<MovieVoteEntity> findByMovieVS(MovieVsEntity movieVS);

  Long countByMovie(MovieInfoEntity movie);
}