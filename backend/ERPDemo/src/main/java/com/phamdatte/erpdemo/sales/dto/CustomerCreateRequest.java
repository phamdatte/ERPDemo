package com.phamdatte.erpdemo.sales.dto;

import jakarta.validation.constraints.NotBlank;

public record CustomerCreateRequest(@NotBlank String code, @NotBlank String name,
                                    String contactName, String phone, String email,
                                    String address, String taxCode) {}
