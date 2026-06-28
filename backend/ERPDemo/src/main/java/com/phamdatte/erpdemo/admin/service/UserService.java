package com.phamdatte.erpdemo.admin.service;

import com.phamdatte.erpdemo.admin.dto.UserCreateRequest;
import com.phamdatte.erpdemo.admin.dto.UserDto;
import com.phamdatte.erpdemo.admin.dto.UserUpdateRequest;
import com.phamdatte.erpdemo.admin.entity.Role;
import com.phamdatte.erpdemo.admin.entity.User;
import com.phamdatte.erpdemo.admin.repository.RoleRepository;
import com.phamdatte.erpdemo.admin.repository.UserRepository;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResponse<UserDto> findAll(Pageable pageable) {
        Page<UserDto> page = userRepository.findAll(pageable).map(this::toDto);
        return PageResponse.of(page);
    }

    public UserDto findById(UUID id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserDto create(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists: " + request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists: " + request.email());
        }
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .active(request.active() != null ? request.active() : true)
                .build();
        if (request.roleIds() != null && !request.roleIds().isEmpty()) {
            Set<Role> roles = fetchRoles(request.roleIds());
            roles.forEach(user::addRole);
        }
        return toDto(userRepository.save(user));
    }

    @Transactional
    public UserDto update(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.active() != null) {
            user.setActive(request.active());
        }
        if (request.roleIds() != null) {
            user.getRoles().forEach(user::removeRole);
            fetchRoles(request.roleIds()).forEach(user::addRole);
        }
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void delete(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }

    @Transactional
    public UserDto assignRoles(UUID userId, List<UUID> roleIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
        user.getRoles().forEach(user::removeRole);
        fetchRoles(roleIds).forEach(user::addRole);
        return toDto(userRepository.save(user));
    }

    private Set<Role> fetchRoles(List<UUID> roleIds) {
        return new HashSet<>(roleRepository.findAllById(roleIds));
    }

    private UserDto toDto(User user) {
        List<com.phamdatte.erpdemo.admin.dto.RoleDto> roleDtos = user.getRoles().stream()
                .map(role -> new com.phamdatte.erpdemo.admin.dto.RoleDto(
                        role.getId(), role.getCode(), role.getName(), role.getDescription()))
                .toList();
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.isActive(),
                roleDtos
        );
    }
}
