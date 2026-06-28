package com.phamdatte.erpdemo.sales.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SalesOrderDto(UUID id, String orderNumber, UUID customerId, String customerName,
                            LocalDate orderDate, String status, String description,
                            List<SalesOrderLineDto> lines) {}
