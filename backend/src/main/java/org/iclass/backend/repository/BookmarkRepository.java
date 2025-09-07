package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<BookMarkEntity, Long> {
  List<BookMarkEntity> findByUser(UsersEntity user);

  @Query("SELECT b FROM BookMarkEntity b WHERE b.user = :user AND b.movie = :movie")
  List<BookMarkEntity> findByUserAndMovie(@Param("user") UsersEntity user, @Param("movie") MovieInfoEntity movie);
  // 09.07 추가
}
