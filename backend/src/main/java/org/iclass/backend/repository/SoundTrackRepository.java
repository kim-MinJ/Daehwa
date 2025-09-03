package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SoundTrackRepository extends JpaRepository<SoundTrackEntity, Long> {
  // 특정 영화에 속한 OST 리스트 조회
  List<SoundTrackEntity> findByMovieInfo_MovieIdx(Long movieIdx);
}