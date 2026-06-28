package com.phamdatte.erpdemo.manufacturing.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.entity.Warehouse;
import com.phamdatte.erpdemo.inventory.repository.WarehouseRepository;
import com.phamdatte.erpdemo.manufacturing.dto.WorkOrderCreateRequest;
import com.phamdatte.erpdemo.manufacturing.dto.WorkOrderDto;
import com.phamdatte.erpdemo.manufacturing.entity.BillOfMaterial;
import com.phamdatte.erpdemo.manufacturing.entity.WorkOrder;
import com.phamdatte.erpdemo.manufacturing.repository.BillOfMaterialRepository;
import com.phamdatte.erpdemo.manufacturing.repository.WorkOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final BillOfMaterialRepository billOfMaterialRepository;
    private final WarehouseRepository warehouseRepository;

    public WorkOrderService(WorkOrderRepository workOrderRepository,
                            BillOfMaterialRepository billOfMaterialRepository,
                            WarehouseRepository warehouseRepository) {
        this.workOrderRepository = workOrderRepository;
        this.billOfMaterialRepository = billOfMaterialRepository;
        this.warehouseRepository = warehouseRepository;
    }

    public PageResponse<WorkOrderDto> list(int page, int size) {
        Page<WorkOrder> result = workOrderRepository.findAllWithRelations(PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public WorkOrderDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public WorkOrderDto create(WorkOrderCreateRequest request) {
        WorkOrder wo = new WorkOrder();
        wo.setOrderNumber(request.orderNumber());
        wo.setQuantity(request.quantity());
        wo.setStartDate(request.startDate());
        wo.setEndDate(request.endDate());
        wo.setDescription(request.description());
        wo.setStatus("DRAFT");

        if (request.bomId() != null) {
            BillOfMaterial bom = billOfMaterialRepository.findById(request.bomId())
                    .orElseThrow(() -> new IllegalArgumentException("BOM not found: " + request.bomId()));
            wo.setBillOfMaterial(bom);
        }
        if (request.warehouseId() != null) {
            Warehouse warehouse = warehouseRepository.findById(request.warehouseId())
                    .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + request.warehouseId()));
            wo.setWarehouse(warehouse);
        }

        return toDto(workOrderRepository.save(wo));
    }

    private WorkOrder find(UUID id) {
        return workOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work order not found: " + id));
    }

    private WorkOrderDto toDto(WorkOrder wo) {
        return new WorkOrderDto(wo.getId(), wo.getOrderNumber(),
                wo.getBillOfMaterial() != null ? wo.getBillOfMaterial().getId() : null,
                wo.getBillOfMaterial() != null ? wo.getBillOfMaterial().getCode() : null,
                wo.getWarehouse() != null ? wo.getWarehouse().getId() : null,
                wo.getWarehouse() != null ? wo.getWarehouse().getName() : null,
                wo.getQuantity(), wo.getStartDate(), wo.getEndDate(),
                wo.getStatus(), wo.getDescription());
    }
}
