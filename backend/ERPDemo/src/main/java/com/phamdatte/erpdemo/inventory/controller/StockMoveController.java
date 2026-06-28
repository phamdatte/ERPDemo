package com.phamdatte.erpdemo.inventory.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.dto.StockMoveCreateRequest;
import com.phamdatte.erpdemo.inventory.dto.StockMoveDto;
import com.phamdatte.erpdemo.inventory.service.StockMoveService;
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
@RequestMapping("/api/inventory/stock-moves")
public class StockMoveController {

    private final StockMoveService stockMoveService;

    public StockMoveController(StockMoveService stockMoveService) {
        this.stockMoveService = stockMoveService;
    }

    @GetMapping
    public ApiResponse<PageResponse<StockMoveDto>> list(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(stockMoveService.list(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<StockMoveDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(stockMoveService.get(id));
    }

    @PostMapping
    public ApiResponse<StockMoveDto> create(@Valid @RequestBody StockMoveCreateRequest request) {
        return ApiResponse.ok(stockMoveService.create(request));
    }
}
