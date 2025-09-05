package org.iclass.backend.repository;

import java.util.List;
<<<<<<< HEAD
=======

import org.iclass.backend.Entity.ReviewEntity;
import org.iclass.backend.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
>>>>>>> ae25e7826b07dfc0a8f1cc5d79cdb317a3802a3a

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
  List<ReviewEntity> findByUser(UsersEntity user);
}