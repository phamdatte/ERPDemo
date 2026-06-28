package com.phamdatte.erpdemo.hr.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.AttendanceCreateRequest;
import com.phamdatte.erpdemo.hr.dto.AttendanceDto;
import com.phamdatte.erpdemo.hr.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/hr/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService service;

    @GetMapping
    public ApiResponse<PageResponse<AttendanceDto>> list(Pageable pageable) {
        return ApiResponse.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<AttendanceDto> detail(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @PostMapping
    public ApiResponse<AttendanceDto> create(@Valid @RequestBody AttendanceCreateRequest req) {
        return ApiResponse.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<AttendanceDto> update(@PathVariable UUID id, @Valid @RequestBody AttendanceCreateRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
