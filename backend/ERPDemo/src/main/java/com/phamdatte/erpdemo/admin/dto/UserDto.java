package com.phamdatte.erpdemo.admin.dto;

import java.util.List;
import java.util.UUID;

public record UserDto(
        UUID id,
        String username,
        String email,
        String fullName,
        boolean active,
        List<RoleDto> roles
) {
}
