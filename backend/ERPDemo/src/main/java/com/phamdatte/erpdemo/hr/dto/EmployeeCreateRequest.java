package com.phamdatte.erpdemo.hr.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record EmployeeCreateRequest(
        @NotBlank String employeeCode,
        @NotBlank String fullName,
        @Email String email,
        String phone,
        String gender,
        LocalDate dateOfBirth,
        @NotNull LocalDate hireDate,
        String status,
        UUID departmentId,
        UUID positionId,
        BigDecimal baseSalary
) {
}
