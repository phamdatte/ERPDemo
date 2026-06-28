package com.phamdatte.erpdemo.accounting.controller;

import com.phamdatte.erpdemo.accounting.dto.ChartOfAccountCreateRequest;
import com.phamdatte.erpdemo.accounting.dto.ChartOfAccountDto;
import com.phamdatte.erpdemo.accounting.service.ChartOfAccountService;
import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/accounting/accounts")
@RequiredArgsConstructor
public class ChartOfAccountController {

    private final ChartOfAccountService service;

    @GetMapping
    public ApiResponse<PageResponse<ChartOfAccountDto>> list(Pageable pageable) {
        return ApiResponse.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<ChartOfAccountDto> detail(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @PostMapping
    public ApiResponse<ChartOfAccountDto> create(@Valid @RequestBody ChartOfAccountCreateRequest req) {
        return ApiResponse.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<ChartOfAccountDto> update(@PathVariable UUID id, @Valid @RequestBody ChartOfAccountCreateRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
