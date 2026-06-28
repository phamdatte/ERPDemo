package com.phamdatte.erpdemo.sales.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.sales.dto.SalesOrderCreateRequest;
import com.phamdatte.erpdemo.sales.dto.SalesOrderDto;
import com.phamdatte.erpdemo.sales.service.SalesOrderService;
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
@RequestMapping("/api/sales/sales-orders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @GetMapping
    public ApiResponse<PageResponse<SalesOrderDto>> list(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(salesOrderService.list(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<SalesOrderDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(salesOrderService.get(id));
    }

    @PostMapping
    public ApiResponse<SalesOrderDto> create(@Valid @RequestBody SalesOrderCreateRequest request) {
        return ApiResponse.ok(salesOrderService.create(request));
    }
}
