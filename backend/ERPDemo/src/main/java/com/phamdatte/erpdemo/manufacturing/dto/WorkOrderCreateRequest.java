package com.phamdatte.erpdemo.manufacturing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record WorkOrderCreateRequest(@NotBlank String orderNumber,
                                     UUID bomId,
                                     UUID warehouseId,
                                     @NotNull BigDecimal quantity,
                                     LocalDate startDate,
                                     LocalDate endDate,
                                     String description) {}
