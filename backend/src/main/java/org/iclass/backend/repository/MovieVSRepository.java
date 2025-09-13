package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.entity.MovieVsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieVSRepository extends JpaRepository<MovieVsEntity, Long> {
  List<MovieVsEntity> findByActive(Integer active);
}