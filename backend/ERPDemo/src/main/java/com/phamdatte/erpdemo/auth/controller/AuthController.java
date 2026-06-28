package com.phamdatte.erpdemo.auth.controller;

import com.phamdatte.erpdemo.admin.entity.User;
import com.phamdatte.erpdemo.admin.repository.RoleRepository;
import com.phamdatte.erpdemo.admin.repository.UserRepository;
import com.phamdatte.erpdemo.auth.dto.AuthResponse;
import com.phamdatte.erpdemo.auth.dto.LoginRequest;
import com.phamdatte.erpdemo.auth.dto.RegisterRequest;
import com.phamdatte.erpdemo.auth.util.JwtUtil;
import com.phamdatte.erpdemo.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Transactional(readOnly = true)
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        String username = authentication.getName();
        List<String> roles = userRepository.findByUsername(username)
                .map(user -> user.getRoles().stream()
                        .map(role -> role.getCode().startsWith("ROLE_") ? role.getCode() : "ROLE_" + role.getCode())
                        .toList())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        String token = jwtUtil.generateToken(username, roles);
        return ApiResponse.ok(new AuthResponse(token, username, roles));
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        var user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .active(true)
                .build();

        var defaultRole = roleRepository.findByCode("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("Default role ROLE_USER not seeded"));
        user.addRole(defaultRole);

        user = userRepository.save(user);

        List<String> roles = List.of("ROLE_USER");
        String token = jwtUtil.generateToken(user.getUsername(), roles);
        return ApiResponse.ok(new AuthResponse(token, user.getUsername(), roles));
    }
}
