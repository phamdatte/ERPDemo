package com.phamdatte.erpdemo.admin.controller;

import com.phamdatte.erpdemo.admin.dto.RoleCreateRequest;
import com.phamdatte.erpdemo.admin.dto.RoleDto;
import com.phamdatte.erpdemo.admin.dto.RoleUpdateRequest;
import com.phamdatte.erpdemo.admin.service.RoleService;
import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/admin/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RoleDto>>> list(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(roleService.findAll(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDto>> detail(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(roleService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleDto>> create(@Valid @RequestBody RoleCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Role created", roleService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Role updated", roleService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Role deleted", null));
    }
}
