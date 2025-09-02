package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookmarkRepository extends JpaRepository<BookMarkEntity, Long> {
  List<BookMarkEntity> findByUser(UsersEntity user);
}