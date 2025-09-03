package org.iclass.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.service.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

  private final UsersService usersService;

  // 회원가입
  @PostMapping("/register")
  public ResponseEntity<Map<String, String>> register(@RequestBody UsersDto usersDto) {
    try {
      usersService.register(usersDto);
      Map<String, String> response = new HashMap<>();
      response.put("message", "회원가입이 성공적으로 완료되었습니다.");
      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      log.error("회원가입 실패: {}", e.getMessage());
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody UsersDto usersDto) {
    try {
      UsersDto loggedInUser = usersService.login(usersDto);

      Map<String, String> response = new HashMap<>();
      response.put("token", loggedInUser.getToken());
      response.put("role", loggedInUser.getRole());
      response.put("message", "로그인 성공");

      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      log.error("로그인 실패: {}", e.getMessage());
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
  }

  // 로그아웃
  @PostMapping("/logout")
  public ResponseEntity<Map<String, String>> logout() {
    usersService.logout();
    Map<String, String> response = new HashMap<>();
    response.put("message", "로그아웃이 완료되었습니다.");
    return ResponseEntity.ok(response);
  }
}