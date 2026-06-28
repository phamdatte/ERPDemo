package com.phamdatte.erpdemo.procurement.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseOrderLineDto(UUID id, UUID productId, String productName, String productCode,
                                   BigDecimal quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
