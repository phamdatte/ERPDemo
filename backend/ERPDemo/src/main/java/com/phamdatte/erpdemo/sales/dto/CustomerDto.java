package com.phamdatte.erpdemo.sales.dto;

import java.util.UUID;

public record CustomerDto(UUID id, String code, String name, String contactName,
                          String phone, String email, String address, String taxCode) {}
