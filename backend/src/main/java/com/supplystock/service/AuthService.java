package com.supplystock.service;

import com.supplystock.dto.AuthDTOs.*;
import com.supplystock.entity.Role;
import com.supplystock.entity.User;
import com.supplystock.repository.RoleRepository;
import com.supplystock.repository.UserRepository;
import com.supplystock.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = tokenProvider.generateTokenForUser(user);
        UserDTO userDTO = toUserDTO(user);
        return new AuthResponse(token, userDTO);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Role role = roleRepository.findByName(request.getRole().toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role(request.getRole().toUpperCase(), "Custom Role")));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(role);
        user.setCompanyName(request.getCompanyName());
        user.setPhone(request.getPhone());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenForUser(savedUser);
        return new AuthResponse(token, toUserDTO(savedUser));
    }

    public UserDTO toUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().getName(),
                user.getCompanyName(),
                user.getPhone()
        );
    }
}
