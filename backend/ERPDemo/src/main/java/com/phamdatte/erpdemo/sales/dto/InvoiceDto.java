package com.phamdatte.erpdemo.sales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record InvoiceDto(UUID id, String invoiceNumber, UUID customerId, String customerName,
                         UUID salesOrderId, String salesOrderNumber,
                         LocalDate invoiceDate, String status,
                         BigDecimal totalAmount, String description) {}
