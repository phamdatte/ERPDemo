package com.phamdatte.erpdemo.accounting.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record ChartOfAccountCreateRequest(
        @NotBlank String code, @NotBlank String name, @NotBlank String type,
        String description, UUID parentId
) {}
