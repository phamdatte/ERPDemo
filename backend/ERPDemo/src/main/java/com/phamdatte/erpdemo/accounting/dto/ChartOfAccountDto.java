package com.phamdatte.erpdemo.accounting.dto;

import java.util.UUID;

public record ChartOfAccountDto(
        UUID id, String code, String name, String type,
        String description, UUID parentId, String parentName
) {}
