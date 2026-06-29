package com.phamdatte.erpdemo.sales.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.sales.dto.CustomerCreateRequest;
import com.phamdatte.erpdemo.sales.dto.CustomerDto;
import com.phamdatte.erpdemo.sales.service.CustomerService;
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
@RequestMapping("/v1/sales/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ApiResponse<PageResponse<CustomerDto>> list(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size,
                                                       @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(customerService.list(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(customerService.get(id));
    }

    @PostMapping
    public ApiResponse<CustomerDto> create(@Valid @RequestBody CustomerCreateRequest request) {
        return ApiResponse.ok(customerService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<CustomerDto> update(@PathVariable UUID id, @Valid @RequestBody CustomerCreateRequest request) {
        return ApiResponse.ok(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        customerService.delete(id);
        return ApiResponse.ok(null);
    }
}
