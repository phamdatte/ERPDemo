package com.phamdatte.erpdemo.procurement.dto;

import java.util.UUID;

public record VendorDto(UUID id, String code, String name, String contactName,
                        String phone, String email, String address) {}
