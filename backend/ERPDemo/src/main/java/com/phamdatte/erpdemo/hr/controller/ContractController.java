package com.phamdatte.erpdemo.hr.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.ContractCreateRequest;
import com.phamdatte.erpdemo.hr.dto.ContractDto;
import com.phamdatte.erpdemo.hr.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/hr/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService service;

    @GetMapping
    public ApiResponse<PageResponse<ContractDto>> list(Pageable pageable) {
        return ApiResponse.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<ContractDto> detail(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @PostMapping
    public ApiResponse<ContractDto> create(@Valid @RequestBody ContractCreateRequest req) {
        return ApiResponse.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<ContractDto> update(@PathVariable UUID id, @Valid @RequestBody ContractCreateRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
