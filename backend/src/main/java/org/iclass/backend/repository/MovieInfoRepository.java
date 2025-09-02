package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
  List<MovieInfoEntity> findByTitleContaining(String keyword);
}