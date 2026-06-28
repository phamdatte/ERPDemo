package com.phamdatte.erpdemo.sales.repository;

import com.phamdatte.erpdemo.sales.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    @Query("""
            SELECT i FROM Invoice i
            LEFT JOIN FETCH i.customer c
            LEFT JOIN FETCH i.salesOrder so
            ORDER BY i.createdAt DESC
            """)
    Page<Invoice> findAllWithCustomer(Pageable pageable);
}
