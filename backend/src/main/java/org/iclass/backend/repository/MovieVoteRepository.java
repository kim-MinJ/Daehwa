package org.iclass.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {

        // ✅ [VS 기반] 특정 VS + 유저로 투표 여부 조회
        Optional<MovieVoteEntity> findByMovieVSAndUser(MovieVsEntity vs, UsersEntity user);

        // ✅ [VS 기반] 특정 VS에 속한 모든 투표 조회
        List<MovieVoteEntity> findByMovieVS(MovieVsEntity vs);

        // ✅ [단일 영화] 단일 영화 + 유저 기준으로 투표 여부 조회
        Optional<MovieVoteEntity> findByMovieAndUser(MovieInfoEntity movie, UsersEntity user);

        // ✅ [단일 영화] 단일 영화 + 유저 + 오늘 날짜 기준으로 투표 여부 조회 (중복 방지)
        @Query("SELECT v FROM MovieVoteEntity v " +
                        "WHERE v.movie = :movie " +
                        "AND v.user = :user " +
                        "AND v.vsDate BETWEEN :startOfDay AND :endOfDay")
        Optional<MovieVoteEntity> findTodayVote(
                        @Param("movie") MovieInfoEntity movie,
                        @Param("user") UsersEntity user,
                        @Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay);

        // ✅ TMDB ID 기준 전체 투표 수
        long countByMovie_TmdbMovieId(Long tmdbMovieId);

        // ✅ 특정 영화 기준 전체 투표 수
        long countByMovie(MovieInfoEntity movie);

        // ✅ 이번 주 투표 수 집계 (월요일 ~ 일요일)
        @Query("SELECT v.movie.tmdbMovieId, COUNT(v) " +
                        "FROM MovieVoteEntity v " +
                        "WHERE v.vsDate BETWEEN :startOfWeek AND :endOfWeek " +
                        "GROUP BY v.movie.tmdbMovieId")
        List<Object[]> countVotesThisWeek(
                        @Param("startOfWeek") LocalDateTime startOfWeek,
                        @Param("endOfWeek") LocalDateTime endOfWeek);

        // ✅ [VS 단위] 특정 VS + 유저 + 오늘 기준 투표 여부 조회
        @Query("SELECT v FROM MovieVoteEntity v " +
                        "WHERE v.movieVS = :vs " +
                        "AND v.user = :user " +
                        "AND v.vsDate BETWEEN :startOfDay AND :endOfDay")
        Optional<MovieVoteEntity> findTodayVoteByVS(
                        @Param("vs") MovieVsEntity vs,
                        @Param("user") UsersEntity user,
                        @Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay);

        // MovieVoteRepository.java
        @Query("SELECT v FROM MovieVoteEntity v WHERE v.user = :user AND v.movieVS.vsRound = :round AND v.movieVS.pair = :pair AND v.vsDate BETWEEN :start AND :end")
        Optional<MovieVoteEntity> findTodayVoteByRoundAndPair(@Param("round") Integer round,
                        @Param("pair") Integer pair,
                        @Param("user") UsersEntity user,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);
}