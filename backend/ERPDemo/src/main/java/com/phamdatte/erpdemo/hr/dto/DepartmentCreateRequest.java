package com.phamdatte.erpdemo.hr.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record DepartmentCreateRequest(
        @NotBlank String code,
        @NotBlank String name,
        String description,
        UUID parentId,
        UUID managerId
) {
}
