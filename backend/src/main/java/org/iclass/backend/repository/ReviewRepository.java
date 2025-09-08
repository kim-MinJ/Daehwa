package org.iclass.backend.repository;

import java.util.List;
import java.util.Optional;

import org.iclass.backend.entity.ReviewEntity;
import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

  List<ReviewEntity> findByUser(UsersEntity user);

  // 영화별 리뷰 개수, 합계, 평균 조회 (isBlind = 0)
  @Query("SELECT COALESCE(AVG(r.rating), 0) FROM ReviewEntity r " +
      "WHERE r.movie.movieIdx = :movieId AND r.isBlind = 0")
  Optional<Double> findAvgRatingByMovie(@Param("movieId") Long movieId);
}
