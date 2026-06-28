package com.phamdatte.erpdemo.hr.dto;

import java.util.UUID;

public record DepartmentDto(
        UUID id,
        String code,
        String name,
        String description,
        UUID parentId,
        String parentName,
        UUID managerId,
        String managerName
) {
}
