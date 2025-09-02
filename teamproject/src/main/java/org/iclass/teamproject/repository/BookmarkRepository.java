package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookmarkRepository extends JpaRepository<BookMarkEntity, Long> {
  List<BookMarkEntity> findByUser(UsersEntity user);
}