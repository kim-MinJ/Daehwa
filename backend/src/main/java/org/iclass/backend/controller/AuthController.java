package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.UsersDto;

import java.time.LocalDateTime;

import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsersDto dto) {
        // Optional로 존재 여부 확인
        if (usersRepository.findByUserId(dto.getUserId()).isPresent()) {
            return ResponseEntity.badRequest().body("exists");
        }

        // 새로운 사용자 저장
        UsersEntity user = UsersEntity.builder()
                .userId(dto.getUserId())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role("user")
                .regDate(LocalDateTime.now()) // 추가
                .status(0) // 추가
                .build();
        usersRepository.save(user);

        // JWT 발급
        String token = jwtTokenProvider.createTokenWithUserId(user.getUserId());

        return ResponseEntity.ok(UsersDto.of(user, token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsersDto dto) {
        UsersEntity user = usersRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtTokenProvider.createTokenWithUserId(user.getUserId());
        return ResponseEntity.ok(UsersDto.of(user, token));
    }
}
