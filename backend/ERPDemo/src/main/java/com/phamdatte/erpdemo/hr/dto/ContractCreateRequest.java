package com.phamdatte.erpdemo.hr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ContractCreateRequest(
        @NotNull UUID employeeId, @NotBlank String contractType,
        @NotNull LocalDate startDate, LocalDate endDate,
        BigDecimal salary, String status
) {}
