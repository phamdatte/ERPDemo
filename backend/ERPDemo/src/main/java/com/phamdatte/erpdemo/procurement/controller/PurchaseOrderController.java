package com.phamdatte.erpdemo.procurement.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.procurement.dto.PurchaseOrderCreateRequest;
import com.phamdatte.erpdemo.procurement.dto.PurchaseOrderDto;
import com.phamdatte.erpdemo.procurement.service.PurchaseOrderService;
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
@RequestMapping("/v1/procurement/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    public ApiResponse<PageResponse<PurchaseOrderDto>> list(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(purchaseOrderService.list(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<PurchaseOrderDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(purchaseOrderService.get(id));
    }

    @PostMapping
    public ApiResponse<PurchaseOrderDto> create(@Valid @RequestBody PurchaseOrderCreateRequest request) {
        return ApiResponse.ok(purchaseOrderService.create(request));
    }
}
