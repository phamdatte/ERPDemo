package com.phamdatte.erpdemo.inventory.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.dto.WarehouseCreateRequest;
import com.phamdatte.erpdemo.inventory.dto.WarehouseDto;
import com.phamdatte.erpdemo.inventory.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/inventory/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public ApiResponse<PageResponse<WarehouseDto>> list(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size,
                                                        @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(warehouseService.list(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<WarehouseDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(warehouseService.get(id));
    }

    @PostMapping
    public ApiResponse<WarehouseDto> create(@Valid @RequestBody WarehouseCreateRequest request) {
        return ApiResponse.ok(warehouseService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<WarehouseDto> update(@PathVariable UUID id, @Valid @RequestBody WarehouseCreateRequest request) {
        return ApiResponse.ok(warehouseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        warehouseService.delete(id);
        return ApiResponse.ok(null);
    }
}
