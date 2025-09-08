package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.asdf.MovieVoteEntity;
import org.iclass.backend.asdf.MovieVsEntity;
import org.iclass.backend.asdf.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {
    // 특정 VS의 전체 투표
    java.util.List<MovieVoteEntity> findByMovieVS(MovieVsEntity movieVS);

    // 특정 VS + User 중복 체크
    Optional<MovieVoteEntity> findByMovieVSAndUser(MovieVsEntity vs, UsersEntity user);
}