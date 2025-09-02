package org.iclass.teamproject.repository;

import org.iclass.teamproject.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PeopleRepository extends JpaRepository<PeopleEntity, Long> {
}