package com.phamdatte.erpdemo.reporting.dto;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Nhân sự theo phòng ban — dùng cho biểu đồ bar/pie chart.
 */
public record HeadcountDto(
        UUID departmentId,
        String departmentCode,
        String departmentName,
        Long employeeCount,
        Long activeEmployees,
        BigDecimal totalSalary
) {}
