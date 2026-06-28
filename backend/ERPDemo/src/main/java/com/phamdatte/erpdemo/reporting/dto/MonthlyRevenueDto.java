package com.phamdatte.erpdemo.reporting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * Doanh thu theo tháng — dùng cho biểu đồ line/area chart.
 */
public record MonthlyRevenueDto(
        Integer year,
        Integer month,
        Long invoiceCount,
        BigDecimal totalAmount,
        BigDecimal paidAmount
) {
    @JsonProperty("monthLabel")
    public String monthLabel() {
        if (year == null || month == null) return null;
        return String.format("%02d/%d", month, year);
    }
}
