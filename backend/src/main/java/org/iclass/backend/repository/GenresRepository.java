package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.Entity.GenresEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenresRepository extends JpaRepository<GenresEntity, Long> {
    Optional<GenresEntity> findByGenreId(Long genreId);
}