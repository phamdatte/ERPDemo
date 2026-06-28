package com.phamdatte.erpdemo.sales.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.sales.dto.InvoiceCreateRequest;
import com.phamdatte.erpdemo.sales.dto.InvoiceDto;
import com.phamdatte.erpdemo.sales.service.InvoiceService;
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
@RequestMapping("/api/sales/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ApiResponse<PageResponse<InvoiceDto>> list(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(invoiceService.list(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<InvoiceDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(invoiceService.get(id));
    }

    @PostMapping
    public ApiResponse<InvoiceDto> create(@Valid @RequestBody InvoiceCreateRequest request) {
        return ApiResponse.ok(invoiceService.create(request));
    }
}
