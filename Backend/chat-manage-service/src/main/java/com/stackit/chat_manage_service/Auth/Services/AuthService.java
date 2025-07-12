package com.stackit.chat_manage_service.Auth.Services;


import com.stackit.chat_manage_service.Auth.Entities.User;
import com.stackit.chat_manage_service.Auth.Payload.auth.AuthResponse;
import com.stackit.chat_manage_service.Auth.Payload.auth.LoginRequest;
import com.stackit.chat_manage_service.Auth.Payload.auth.SignUpRequest;
import com.stackit.chat_manage_service.Auth.Payload.auth.UserResponseDTO;
import com.stackit.chat_manage_service.Auth.Repository.UserRepository;
import com.stackit.chat_manage_service.Auth.Utills.JwtUtils;
import com.stackit.chat_manage_service.Entity.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse signup(SignUpRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setDisplayName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER); // Default role

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtils.generateToken(savedUser.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getDisplayName(),
                savedUser.getRole().name(),
                savedUser.getId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = jwtUtils.generateToken(authentication);

        // Get user details
        User user = userRepository.findByUsernameOrEmail(request.getLogin(), request.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(
                token,
                "Bearer",
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name(),
                user.getId()
        );
    }

    public UserResponseDTO getCurrentUserDetails() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(email);
        User user = userRepository.findByEmailOrUsername(email,email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDto(user);
    }

    private UserResponseDTO mapToDto(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setDisplayName(user.getDisplayName());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setIsBanned(user.getIsBanned());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setReputationScore(user.getReputationScore());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}