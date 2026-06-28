package com.phamdatte.erpdemo.procurement.repository;

import com.phamdatte.erpdemo.procurement.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, UUID> {
    Optional<Vendor> findByCode(String code);
    Page<Vendor> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
