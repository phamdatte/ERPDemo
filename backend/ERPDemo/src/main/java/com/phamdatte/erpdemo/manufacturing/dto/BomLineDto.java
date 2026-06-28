package com.phamdatte.erpdemo.manufacturing.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record BomLineDto(UUID id, UUID productId, String productName, String productCode,
                         BigDecimal quantity) {}
