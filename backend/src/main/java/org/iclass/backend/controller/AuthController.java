package org.iclass.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsersDto dto) {
        if (usersRepository.existsById(dto.getUserId())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "이미 존재하는 아이디입니다."));
        }

        UsersEntity user = UsersEntity.builder()
                .userId(dto.getUserId())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role("user")
                .regDate(LocalDateTime.now())
                .status(0)
                .build();

        usersRepository.save(user);

        String token = jwtTokenProvider.createTokenWithUserId(user.getUserId());

        return ResponseEntity.ok(Map.of(
                "userId", user.getUserId(),
                "username", user.getUsername(),
                "role", user.getRole(),
                "regDate", user.getRegDate(),
                "status", user.getStatus(),
                "token", token));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsersDto dto) {
        UsersEntity user = usersRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "비밀번호 불일치"));
        }

        String token = jwtTokenProvider.createTokenWithUserId(user.getUserId());

        return ResponseEntity.ok(Map.of(
                "userId", user.getUserId(),
                "username", user.getUsername(),
                "role", user.getRole(),
                "regDate", user.getRegDate(),
                "status", user.getStatus(),
                "token", token));
    }
}
