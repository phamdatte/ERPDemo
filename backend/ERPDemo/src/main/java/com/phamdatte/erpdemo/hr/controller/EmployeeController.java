package com.phamdatte.erpdemo.hr.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.EmployeeCreateRequest;
import com.phamdatte.erpdemo.hr.dto.EmployeeDto;
import com.phamdatte.erpdemo.hr.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/hr/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @GetMapping
    public ApiResponse<PageResponse<EmployeeDto>> list(Pageable pageable) {
        return ApiResponse.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<EmployeeDto> detail(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @PostMapping
    public ApiResponse<EmployeeDto> create(@Valid @RequestBody EmployeeCreateRequest req) {
        return ApiResponse.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<EmployeeDto> update(@PathVariable UUID id, @Valid @RequestBody EmployeeCreateRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
