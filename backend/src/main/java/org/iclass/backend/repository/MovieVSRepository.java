package org.iclass.backend.repository;

import org.iclass.backend.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieVSRepository extends JpaRepository<MovieVsEntity, Long> {
}