package com.phamdatte.erpdemo.inventory.repository;

import com.phamdatte.erpdemo.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findByCode(String code);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
