package com.phamdatte.erpdemo.sales.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record InvoiceCreateRequest(@NotBlank String invoiceNumber,
                                   @NotNull UUID customerId,
                                   UUID salesOrderId,
                                   @NotNull LocalDate invoiceDate,
                                   @NotNull BigDecimal totalAmount,
                                   String description) {}
