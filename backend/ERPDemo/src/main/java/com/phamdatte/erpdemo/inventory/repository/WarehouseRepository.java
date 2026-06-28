package com.phamdatte.erpdemo.inventory.repository;

import com.phamdatte.erpdemo.inventory.entity.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    Optional<Warehouse> findByCode(String code);
    Page<Warehouse> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
