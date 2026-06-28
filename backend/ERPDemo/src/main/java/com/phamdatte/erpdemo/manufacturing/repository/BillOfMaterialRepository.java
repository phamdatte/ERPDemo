package com.phamdatte.erpdemo.manufacturing.repository;

import com.phamdatte.erpdemo.manufacturing.entity.BillOfMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BillOfMaterialRepository extends JpaRepository<BillOfMaterial, UUID> {

    @Query("""
            SELECT bom FROM BillOfMaterial bom
            LEFT JOIN FETCH bom.product p
            LEFT JOIN FETCH bom.lines l
            LEFT JOIN FETCH l.product lp
            WHERE bom.id = :id
            """)
    Optional<BillOfMaterial> findWithLinesById(@Param("id") UUID id);

    @Query("""
            SELECT bom FROM BillOfMaterial bom
            LEFT JOIN FETCH bom.product p
            ORDER BY bom.createdAt DESC
            """)
    Page<BillOfMaterial> findAllWithProduct(Pageable pageable);
}
