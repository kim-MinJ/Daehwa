package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RankingRepository extends JpaRepository<RankingEntity, Long> {
  List<RankingEntity> findByMovie(MovieInfoEntity movie);
}