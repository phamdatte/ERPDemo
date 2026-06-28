package com.phamdatte.erpdemo.procurement.dto;

import jakarta.validation.constraints.NotBlank;

public record VendorCreateRequest(@NotBlank String code, @NotBlank String name,
                                  String contactName, String phone, String email, String address) {}
