package com.phamdatte.erpdemo.sales.repository;

import com.phamdatte.erpdemo.sales.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByCode(String code);
    Page<Customer> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
