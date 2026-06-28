package com.phamdatte.erpdemo.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public record WarehouseCreateRequest(@NotBlank String code, @NotBlank String name,
                                     String description, String address) {}
