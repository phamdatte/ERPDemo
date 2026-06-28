package com.phamdatte.erpdemo.accounting.controller;

import com.phamdatte.erpdemo.accounting.dto.JournalEntryCreateRequest;
import com.phamdatte.erpdemo.accounting.dto.JournalEntryDto;
import com.phamdatte.erpdemo.accounting.service.JournalEntryService;
import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/accounting/journal-entries")
@RequiredArgsConstructor
public class JournalEntryController {

    private final JournalEntryService service;

    @GetMapping
    public ApiResponse<PageResponse<JournalEntryDto>> list(Pageable pageable) {
        return ApiResponse.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<JournalEntryDto> detail(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @PostMapping
    public ApiResponse<JournalEntryDto> create(@Valid @RequestBody JournalEntryCreateRequest req) {
        return ApiResponse.ok(service.create(req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
