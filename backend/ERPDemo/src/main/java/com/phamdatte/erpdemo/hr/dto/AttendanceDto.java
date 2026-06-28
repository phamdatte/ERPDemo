package com.phamdatte.erpdemo.hr.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AttendanceDto(
        UUID id, UUID employeeId, String employeeName,
        LocalDate workDate, LocalTime checkIn, LocalTime checkOut,
        String status, String note
) {}
