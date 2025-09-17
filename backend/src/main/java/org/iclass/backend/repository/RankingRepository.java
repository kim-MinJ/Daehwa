package org.iclass.backend.repository;

import java.util.List;
import java.util.Optional;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.RankingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RankingRepository extends JpaRepository<RankingEntity, Long> {

    Optional<RankingEntity> findByMovie(MovieInfoEntity movie);

    @Modifying
    @Query("UPDATE RankingEntity r SET r.rankingCount = :ratingAvg, r.createdDate = CURRENT_TIMESTAMP " +
            "WHERE r.movie.movieIdx = :movieId")
    void updateRankingByMovie(@Param("movieId") Long movieId, @Param("ratingAvg") double ratingAvg);
}