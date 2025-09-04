package org.iclass.backend.repository;

import org.iclass.backend.Entity.MovieVoteEntity;
import org.iclass.backend.Entity.MovieVsEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {
    // 특정 VS의 전체 투표
    java.util.List<MovieVoteEntity> findByMovieVS(MovieVsEntity movieVS);

    // 특정 VS + User 중복 체크
    Optional<MovieVoteEntity> findByMovieVSAndUser(MovieVsEntity vs, UsersEntity user);
}