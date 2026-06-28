package com.phamdatte.erpdemo.auth.dto;

import java.util.List;

public record AuthResponse(
        String token,
        String username,
        List<String> roles
) {
}
