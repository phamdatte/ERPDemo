package com.phamdatte.erpdemo.procurement.repository;

import com.phamdatte.erpdemo.procurement.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {

    @Query("""
            SELECT po FROM PurchaseOrder po
            LEFT JOIN FETCH po.vendor v
            LEFT JOIN FETCH po.lines l
            LEFT JOIN FETCH l.product p
            WHERE po.id = :id
            """)
    Optional<PurchaseOrder> findWithLinesById(@Param("id") UUID id);

    @Query("""
            SELECT po FROM PurchaseOrder po
            LEFT JOIN FETCH po.vendor v
            ORDER BY po.createdAt DESC
            """)
    Page<PurchaseOrder> findAllWithVendor(Pageable pageable);
}
