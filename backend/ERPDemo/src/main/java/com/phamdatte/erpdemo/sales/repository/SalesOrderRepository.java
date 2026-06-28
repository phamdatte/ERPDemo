package com.phamdatte.erpdemo.sales.repository;

import com.phamdatte.erpdemo.sales.entity.SalesOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, UUID> {

    @Query("""
            SELECT so FROM SalesOrder so
            LEFT JOIN FETCH so.customer c
            LEFT JOIN FETCH so.lines l
            LEFT JOIN FETCH l.product p
            WHERE so.id = :id
            """)
    Optional<SalesOrder> findWithLinesById(@Param("id") UUID id);

    @Query("""
            SELECT so FROM SalesOrder so
            LEFT JOIN FETCH so.customer c
            ORDER BY so.createdAt DESC
            """)
    Page<SalesOrder> findAllWithCustomer(Pageable pageable);
}
