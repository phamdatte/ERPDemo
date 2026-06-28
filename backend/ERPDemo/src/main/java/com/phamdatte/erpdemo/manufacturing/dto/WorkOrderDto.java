package com.phamdatte.erpdemo.manufacturing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record WorkOrderDto(UUID id, String orderNumber, UUID bomId, String bomCode,
                           UUID warehouseId, String warehouseName,
                           BigDecimal quantity, LocalDate startDate, LocalDate endDate,
                           String status, String description) {}
