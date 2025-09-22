// package org.iclass.backend.repository;

// import java.util.List;

// import org.iclass.backend.entity.SoundTrackEntity;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// @Repository
// public interface SoundTrackRepository extends JpaRepository<SoundTrackEntity,
// Long> {
// // 특정 영화에 속한 OST 리스트 조회
// List<SoundTrackEntity> findByMovieInfo_MovieIdx(Long movieIdx);
// }