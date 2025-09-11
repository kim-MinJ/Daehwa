package org.iclass.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
// import org.iclass.backend.service.AuthService;
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
        // private final AuthService authService;

        // 커밋용
        // 회원가입
        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody UsersDto dto) {
                System.out.println("회원가입 userId: " + dto.getUserId());
                System.out.println("회원가입 username: " + dto.getUsername());
                System.out.println("회원가입 password: " + dto.getPassword());

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
                                .status(0) // 기본 정상
                                .build();

                usersRepository.save(user);

                String token = jwtTokenProvider.generateToken(user.getUserId());

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

                System.out.println("로그인 userId: " + dto.getUserId());
                System.out.println("로그인 username: " + dto.getUsername());
                System.out.println("로그인 password (원문): " + dto.getPassword());

                if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("message", "비밀번호 불일치"));
                }

                // ✅ 상태값 체크
                if (user.getStatus() == 2) {
                        return ResponseEntity.status(403).body(Map.of("message", "정지된 계정입니다."));
                }
                if (user.getStatus() == 1) {
                        return ResponseEntity.status(403).body(Map.of("message", "접속제한 중인 계정입니다."));
                }

                String token = jwtTokenProvider.generateToken(user.getUserId());

                return ResponseEntity.ok(Map.of(
                                "userId", user.getUserId(),
                                "username", user.getUsername(),
                                "role", user.getRole(),
                                "regDate", user.getRegDate(),
                                "status", user.getStatus(),
                                "token", token));
        }
}