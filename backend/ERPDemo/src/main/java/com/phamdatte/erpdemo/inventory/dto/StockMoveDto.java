package com.phamdatte.erpdemo.inventory.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StockMoveDto(UUID id, UUID productId, String productName, String productCode,
                           UUID warehouseId, String warehouseName, String moveType,
                           BigDecimal quantity, String note) {}
