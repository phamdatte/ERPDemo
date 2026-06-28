package com.phamdatte.erpdemo.inventory.dto;

import java.util.UUID;

public record WarehouseDto(UUID id, String code, String name, String description, String address) {}
