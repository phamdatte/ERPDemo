package com.phamdatte.erpdemo.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PurchaseOrderCreateRequest(@NotBlank String orderNumber,
                                         @NotNull UUID vendorId,
                                         @NotNull LocalDate orderDate,
                                         String description,
                                         @NotEmpty List<PurchaseOrderLineRequest> lines) {}
