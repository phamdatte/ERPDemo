package com.phamdatte.erpdemo.manufacturing.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.manufacturing.dto.BillOfMaterialCreateRequest;
import com.phamdatte.erpdemo.manufacturing.dto.BillOfMaterialDto;
import com.phamdatte.erpdemo.manufacturing.service.BillOfMaterialService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/manufacturing/boms")
public class BillOfMaterialController {

    private final BillOfMaterialService billOfMaterialService;

    public BillOfMaterialController(BillOfMaterialService billOfMaterialService) {
        this.billOfMaterialService = billOfMaterialService;
    }

    @GetMapping
    public ApiResponse<PageResponse<BillOfMaterialDto>> list(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(billOfMaterialService.list(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<BillOfMaterialDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(billOfMaterialService.get(id));
    }

    @PostMapping
    public ApiResponse<BillOfMaterialDto> create(@Valid @RequestBody BillOfMaterialCreateRequest request) {
        return ApiResponse.ok(billOfMaterialService.create(request));
    }
}
