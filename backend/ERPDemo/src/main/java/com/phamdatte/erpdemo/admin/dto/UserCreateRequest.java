package com.phamdatte.erpdemo.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record UserCreateRequest(
        @NotBlank String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password,
        String fullName,
        Boolean active,
        List<UUID> roleIds
) {
}
