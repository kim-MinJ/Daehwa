package org.iclass.backend.repository;

import org.iclass.backend.entity.FeelingGenreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeelingGenreRepository extends JpaRepository<FeelingGenreEntity, Long> {
  List<FeelingGenreEntity> findByFeelingType(String feelingType);
}
