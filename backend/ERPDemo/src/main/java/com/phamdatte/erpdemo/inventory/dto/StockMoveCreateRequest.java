package com.phamdatte.erpdemo.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record StockMoveCreateRequest(@NotNull UUID productId, @NotNull UUID warehouseId,
                                     @NotBlank String moveType, @NotNull BigDecimal quantity,
                                     String note) {}
