package com.phamdatte.erpdemo.reporting.dto;

import java.math.BigDecimal;

/**
 * Stat card cho dashboard tổng hợp.
 */
public record DashboardStatDto(
        String module,
        String label,
        Long count,
        BigDecimal amount,
        String icon
) {}
