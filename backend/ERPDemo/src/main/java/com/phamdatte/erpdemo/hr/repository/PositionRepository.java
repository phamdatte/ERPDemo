package com.phamdatte.erpdemo.hr.repository;

import com.phamdatte.erpdemo.hr.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PositionRepository extends JpaRepository<Position, UUID> {
    Optional<Position> findByCode(String code);
    boolean existsByCode(String code);
}
