package com.phamdatte.erpdemo.manufacturing.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.manufacturing.dto.WorkOrderCreateRequest;
import com.phamdatte.erpdemo.manufacturing.dto.WorkOrderDto;
import com.phamdatte.erpdemo.manufacturing.service.WorkOrderService;
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
@RequestMapping("/v1/manufacturing/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping
    public ApiResponse<PageResponse<WorkOrderDto>> list(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(workOrderService.list(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<WorkOrderDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(workOrderService.get(id));
    }

    @PostMapping
    public ApiResponse<WorkOrderDto> create(@Valid @RequestBody WorkOrderCreateRequest request) {
        return ApiResponse.ok(workOrderService.create(request));
    }
}
