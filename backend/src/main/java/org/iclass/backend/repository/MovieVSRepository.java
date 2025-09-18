package org.iclass.backend.repository;

import java.util.List;
import java.util.Optional;

import org.iclass.backend.entity.MovieVsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieVSRepository extends JpaRepository<MovieVsEntity, Long> {
  Optional<MovieVsEntity> findByActive(int active);

  // 특정 round에서 최대 pair 조회
  @Query("SELECT COALESCE(MAX(v.pair), 0) FROM MovieVsEntity v WHERE v.vsRound = :round")
  int findMaxPairByRound(@Param("round") int round);

  // 활성화된 VS 모두 조회
  List<MovieVsEntity> findAllByActive(int active);
}