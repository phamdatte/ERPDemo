package com.phamdatte.erpdemo.auth.service;

import com.phamdatte.erpdemo.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(user -> {
                    List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                            .map(role -> role.getCode().startsWith("ROLE_") ? role.getCode() : "ROLE_" + role.getCode())
                            .map(SimpleGrantedAuthority::new)
                            .toList();

                    return new User(user.getUsername(), user.getPasswordHash(), user.isActive(),
                            true, true, true, authorities);
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
