package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RankingRepository extends JpaRepository<RankingEntity, Long> {
  List<RankingEntity> findByMovie(MovieInfoEntity movie);
}