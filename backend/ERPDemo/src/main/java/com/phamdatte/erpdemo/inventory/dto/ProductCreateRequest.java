package com.phamdatte.erpdemo.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record ProductCreateRequest(@NotBlank String code, @NotBlank String name,
                                   String description, String unit, BigDecimal unitPrice) {}
