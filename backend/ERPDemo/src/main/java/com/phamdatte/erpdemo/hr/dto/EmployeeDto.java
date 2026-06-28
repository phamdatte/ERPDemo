package com.phamdatte.erpdemo.hr.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record EmployeeDto(
        UUID id,
        String employeeCode,
        String fullName,
        String email,
        String phone,
        String gender,
        LocalDate dateOfBirth,
        LocalDate hireDate,
        String status,
        UUID departmentId,
        String departmentName,
        UUID positionId,
        String positionName,
        BigDecimal baseSalary
) {
}
