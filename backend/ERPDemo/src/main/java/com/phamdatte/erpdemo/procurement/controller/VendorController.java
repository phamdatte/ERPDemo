package com.phamdatte.erpdemo.procurement.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.procurement.dto.VendorCreateRequest;
import com.phamdatte.erpdemo.procurement.dto.VendorDto;
import com.phamdatte.erpdemo.procurement.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/procurement/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ApiResponse<PageResponse<VendorDto>> list(@RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "20") int size,
                                                     @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(vendorService.list(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<VendorDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(vendorService.get(id));
    }

    @PostMapping
    public ApiResponse<VendorDto> create(@Valid @RequestBody VendorCreateRequest request) {
        return ApiResponse.ok(vendorService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<VendorDto> update(@PathVariable UUID id, @Valid @RequestBody VendorCreateRequest request) {
        return ApiResponse.ok(vendorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        vendorService.delete(id);
        return ApiResponse.ok(null);
    }
}
