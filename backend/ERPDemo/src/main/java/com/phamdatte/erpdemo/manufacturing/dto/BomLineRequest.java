package com.phamdatte.erpdemo.manufacturing.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record BomLineRequest(@NotNull UUID productId,
                             @NotNull BigDecimal quantity) {}
