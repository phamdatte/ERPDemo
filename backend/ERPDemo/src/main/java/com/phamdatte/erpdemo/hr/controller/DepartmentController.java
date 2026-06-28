package com.phamdatte.erpdemo.hr.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.DepartmentCreateRequest;
import com.phamdatte.erpdemo.hr.dto.DepartmentDto;
import com.phamdatte.erpdemo.hr.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/hr/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;

    @GetMapping
    public ApiResponse<PageResponse<DepartmentDto>> list(Pageable pageable) {
        return ApiResponse.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<DepartmentDto> detail(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @PostMapping
    public ApiResponse<DepartmentDto> create(@Valid @RequestBody DepartmentCreateRequest req) {
        return ApiResponse.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<DepartmentDto> update(@PathVariable UUID id, @Valid @RequestBody DepartmentCreateRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
