package com.phamdatte.erpdemo.sales.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record SalesOrderLineRequest(@NotNull UUID productId,
                                    @NotNull BigDecimal quantity,
                                    @NotNull BigDecimal unitPrice) {}
