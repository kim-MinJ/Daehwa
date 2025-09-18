package org.iclass.backend.repository;

import java.util.Optional;

import org.iclass.backend.entity.GenresEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenresRepository extends JpaRepository<GenresEntity, Long> {
    Optional<GenresEntity> findByGenreId(Long genreId);

    Optional<GenresEntity> findByName(String name);
}