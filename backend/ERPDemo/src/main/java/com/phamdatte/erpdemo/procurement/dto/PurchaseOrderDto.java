package com.phamdatte.erpdemo.procurement.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PurchaseOrderDto(UUID id, String orderNumber, UUID vendorId, String vendorName,
                               LocalDate orderDate, String status, String description,
                               List<PurchaseOrderLineDto> lines) {}
