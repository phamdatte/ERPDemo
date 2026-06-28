package com.phamdatte.erpdemo.inventory.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.dto.WarehouseCreateRequest;
import com.phamdatte.erpdemo.inventory.dto.WarehouseDto;
import com.phamdatte.erpdemo.inventory.entity.Warehouse;
import com.phamdatte.erpdemo.inventory.repository.WarehouseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public PageResponse<WarehouseDto> list(int page, int size, String keyword) {
        Page<Warehouse> result = (keyword == null || keyword.isBlank())
                ? warehouseRepository.findAll(PageRequest.of(page, size))
                : warehouseRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public WarehouseDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public WarehouseDto create(WarehouseCreateRequest request) {
        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setDescription(request.description());
        warehouse.setAddress(request.address());
        return toDto(warehouseRepository.save(warehouse));
    }

    @Transactional
    public WarehouseDto update(UUID id, WarehouseCreateRequest request) {
        Warehouse warehouse = find(id);
        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setDescription(request.description());
        warehouse.setAddress(request.address());
        return toDto(warehouseRepository.save(warehouse));
    }

    @Transactional
    public void delete(UUID id) {
        Warehouse warehouse = find(id);
        warehouse.setDeleted(true);
        warehouseRepository.save(warehouse);
    }

    private Warehouse find(UUID id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + id));
    }

    private WarehouseDto toDto(Warehouse warehouse) {
        return new WarehouseDto(warehouse.getId(), warehouse.getCode(), warehouse.getName(),
                warehouse.getDescription(), warehouse.getAddress());
    }
}
