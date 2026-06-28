package com.phamdatte.erpdemo.procurement.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseOrderLineRequest(@NotNull UUID productId,
                                       @NotNull BigDecimal quantity,
                                       @NotNull BigDecimal unitPrice) {}
