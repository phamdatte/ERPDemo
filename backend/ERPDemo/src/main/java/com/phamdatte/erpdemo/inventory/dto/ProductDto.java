package com.phamdatte.erpdemo.inventory.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductDto(UUID id, String code, String name, String description,
                         String unit, BigDecimal unitPrice) {}
