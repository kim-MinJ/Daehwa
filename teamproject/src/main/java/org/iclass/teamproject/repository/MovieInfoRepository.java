package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
  List<MovieInfoEntity> findByTitleContaining(String keyword);
}