package com.phamdatte.erpdemo.hr.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ContractDto(
        UUID id, UUID employeeId, String employeeName,
        String contractType, LocalDate startDate, LocalDate endDate,
        BigDecimal salary, String status
) {}
