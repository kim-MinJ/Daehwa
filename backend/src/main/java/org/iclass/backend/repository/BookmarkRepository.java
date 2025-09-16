package org.iclass.backend.repository;

import java.util.List;

import org.iclass.backend.entity.BookMarkEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookmarkRepository extends JpaRepository<BookMarkEntity, Long> {

    List<BookMarkEntity> findByUser(UsersEntity user);

    void deleteAllByUser(UsersEntity user);

    @Query("SELECT b FROM BookMarkEntity b WHERE b.user = :user AND b.movie = :movie")
    List<BookMarkEntity> findByUserAndMovie(@Param("user") UsersEntity user, @Param("movie") MovieInfoEntity movie);
}