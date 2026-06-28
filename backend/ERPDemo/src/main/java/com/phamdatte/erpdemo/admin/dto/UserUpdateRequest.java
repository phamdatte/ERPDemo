package com.phamdatte.erpdemo.admin.dto;

import java.util.List;
import java.util.UUID;

public record UserUpdateRequest(
        String email,
        String fullName,
        Boolean active,
        List<UUID> roleIds
) {
}
