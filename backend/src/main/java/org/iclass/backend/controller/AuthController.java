package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public UsersDto login(@RequestBody UsersDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserId(), request.getPassword()));

        UsersEntity user = usersRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        String token = jwtTokenProvider.createToken(authentication);
        return UsersDto.of(user, token);
    }

    // 로그인/회원가입 이후 사용자 정보 반환용
    @GetMapping("/me")
    public UsersDto getMyInfo(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("토큰 없음");
        }

        String token = authHeader.substring(7);
        String userId = jwtTokenProvider.getUsernameFromToken(token);

        UsersEntity user = usersRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return UsersDto.of(user, token);
    }

    @PostMapping("/register")
    public UsersDto register(@RequestBody UsersDto request) {
        if (usersRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        UsersEntity user = UsersEntity.builder()
                .userId(request.getUserId())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("user")
                .status(0)
                .regDate(LocalDateTime.now())
                .build();

        usersRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserId(), request.getPassword()));
        String token = jwtTokenProvider.createToken(authentication);
        return UsersDto.of(user, token);
    }
}
