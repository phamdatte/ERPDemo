package com.phamdatte.erpdemo.admin.dto;

import java.util.UUID;

public record RoleDto(UUID id, String code, String name, String description) {
}
