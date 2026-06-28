package com.phamdatte.erpdemo.hr.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AttendanceCreateRequest(
        @NotNull UUID employeeId, @NotNull LocalDate workDate,
        LocalTime checkIn, LocalTime checkOut,
        String status, String note
) {}
