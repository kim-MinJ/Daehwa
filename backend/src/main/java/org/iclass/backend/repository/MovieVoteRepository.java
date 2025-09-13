package org.iclass.backend.repository;

import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {

    // ✅ 특정 VS + 유저로 투표 여부 조회
    Optional<MovieVoteEntity> findByMovieVSAndUser(MovieVsEntity vs, UsersEntity user);

    // ✅ 특정 VS에 속한 모든 투표 조회
    List<MovieVoteEntity> findByMovieVS(MovieVsEntity vs);

    // ✅ TMDB ID 기준으로 전체 투표 수 집계
    long countByMovie_TmdbMovieId(Long tmdbMovieId);
}