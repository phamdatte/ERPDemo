package com.phamdatte.erpdemo.admin.service;

import com.phamdatte.erpdemo.admin.dto.RoleCreateRequest;
import com.phamdatte.erpdemo.admin.dto.RoleDto;
import com.phamdatte.erpdemo.admin.dto.RoleUpdateRequest;
import com.phamdatte.erpdemo.admin.entity.Role;
import com.phamdatte.erpdemo.admin.repository.RoleRepository;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleService {

    private final RoleRepository roleRepository;

    public PageResponse<RoleDto> findAll(Pageable pageable) {
        Page<RoleDto> page = roleRepository.findAll(pageable).map(this::toDto);
        return PageResponse.of(page);
    }

    public RoleDto findById(UUID id) {
        return roleRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + id));
    }

    @Transactional
    public RoleDto create(RoleCreateRequest request) {
        if (roleRepository.existsByCode(request.code())) {
            throw new IllegalArgumentException("Role code already exists: " + request.code());
        }
        Role role = Role.builder()
                .code(request.code())
                .name(request.name())
                .description(request.description())
                .build();
        return toDto(roleRepository.save(role));
    }

    @Transactional
    public RoleDto update(UUID id, RoleUpdateRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + id));
        if (request.name() != null) {
            role.setName(request.name());
        }
        if (request.description() != null) {
            role.setDescription(request.description());
        }
        return toDto(roleRepository.save(role));
    }

    @Transactional
    public void delete(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + id));
        role.setDeleted(true);
        roleRepository.save(role);
    }

    private RoleDto toDto(Role role) {
        return new RoleDto(role.getId(), role.getCode(), role.getName(), role.getDescription());
    }
}
