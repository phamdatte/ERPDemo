package com.phamdatte.erpdemo.admin.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record AssignRoleRequest(@NotNull List<UUID> roleIds) {
}
