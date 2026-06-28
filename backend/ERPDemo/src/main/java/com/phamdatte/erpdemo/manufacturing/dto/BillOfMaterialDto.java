package com.phamdatte.erpdemo.manufacturing.dto;

import java.util.List;
import java.util.UUID;

public record BillOfMaterialDto(UUID id, String code, UUID productId, String productName,
                                String description, List<BomLineDto> lines) {}
