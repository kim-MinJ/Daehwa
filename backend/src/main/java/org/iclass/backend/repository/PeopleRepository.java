package org.iclass.backend.repository;

import org.iclass.backend.Entity.PeopleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeopleRepository extends JpaRepository<PeopleEntity, Long> {
}