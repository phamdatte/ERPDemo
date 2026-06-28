package com.phamdatte.erpdemo.manufacturing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record BillOfMaterialCreateRequest(@NotBlank String code,
                                          @NotNull UUID productId,
                                          String description,
                                          @NotEmpty List<BomLineRequest> lines) {}
