package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenresRepository extends JpaRepository<GenresEntity, Long> {
}