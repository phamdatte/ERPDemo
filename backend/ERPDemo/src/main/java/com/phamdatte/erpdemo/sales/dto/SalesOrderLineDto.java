package com.phamdatte.erpdemo.sales.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SalesOrderLineDto(UUID id, UUID productId, String productName, String productCode,
                                BigDecimal quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
