package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieVSRepository extends JpaRepository<MovieVsEntity, Long> {
}