package com.phamdatte.erpdemo.manufacturing.repository;

import com.phamdatte.erpdemo.manufacturing.entity.WorkOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, UUID> {

    @Query("""
            SELECT wo FROM WorkOrder wo
            LEFT JOIN FETCH wo.billOfMaterial bom
            LEFT JOIN FETCH wo.warehouse w
            ORDER BY wo.createdAt DESC
            """)
    Page<WorkOrder> findAllWithRelations(Pageable pageable);
}
