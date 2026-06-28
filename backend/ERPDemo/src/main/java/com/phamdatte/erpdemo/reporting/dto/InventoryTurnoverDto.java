package com.phamdatte.erpdemo.reporting.dto;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Tồn kho theo sản phẩm — dùng cho bảng tồn kho & biểu đồ.
 */
public record InventoryTurnoverDto(
        UUID productId,
        String productCode,
        String productName,
        String unit,
        String warehouseName,
        BigDecimal stockIn,
        BigDecimal stockOut
) {
    public BigDecimal balance() {
        if (stockIn == null && stockOut == null) return BigDecimal.ZERO;
        BigDecimal in = stockIn != null ? stockIn : BigDecimal.ZERO;
        BigDecimal out = stockOut != null ? stockOut : BigDecimal.ZERO;
        return in.subtract(out);
    }
}
