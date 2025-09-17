package org.iclass.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.iclass.backend.entity.MovieVoteEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieVoteRepository extends JpaRepository<MovieVoteEntity, Long> {
    
    // ✅ 특정 VS + 유저로 투표 여부 조회
    Optional<MovieVoteEntity> findByMovieVSAndUser(MovieVsEntity vs, UsersEntity user);

    // ✅ 특정 VS에 속한 모든 투표 조회
    List<MovieVoteEntity> findByMovieVS(MovieVsEntity vs);

    // ✅ TMDB ID 기준으로 전체 투표 수 집계
    long countByMovie_TmdbMovieId(Long tmdbMovieId);

    @Query("SELECT v.movie.tmdbMovieId, COUNT(v) " +
       "FROM MovieVoteEntity v " +
       "WHERE v.vsDate BETWEEN :startOfWeek AND :endOfWeek " +
       "GROUP BY v.movie.tmdbMovieId")
    List<Object[]> countVotesThisWeek(@Param("startOfWeek") LocalDateTime startOfWeek,
                                  @Param("endOfWeek") LocalDateTime endOfWeek);

                                  
}
