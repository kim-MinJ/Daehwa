package org.iclass.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
public class UsersController {

  private final UsersService usersService;

  public UsersController(UsersService usersService) {
    this.usersService = usersService;
  }

  // --- 사용자 정보 수정 (username) ---
  @PutMapping("/update")
  public ResponseEntity<UsersDto> updateUser(@RequestBody Map<String, String> body, HttpServletRequest request) {
    UsersDto currentUser = usersService.getUserFromToken(request);
    if (currentUser == null)
      return ResponseEntity.status(401).build();

    String newUsername = body.get("username");
    if (newUsername == null || newUsername.isBlank())
      return ResponseEntity.badRequest().build();

    UsersDto updated = usersService.updateUsername(currentUser.getUserId(), newUsername);
    return ResponseEntity.ok(updated);
  }

  // --- 관리자: 사용자 상태 변경 ---
  @PatchMapping("/{userId}/status")
  public ResponseEntity<UsersDto> updateUserStatus(
      @PathVariable String userId,
      @RequestBody Map<String, Integer> body,
      HttpServletRequest request) {

    UsersDto currentUser = usersService.getUserFromToken(request);
    if (currentUser == null || !"admin".equals(currentUser.getRole())) {
      return ResponseEntity.status(403).build(); // 관리자만
    }

    Integer status = body.get("status");
    if (status == null || status < 0 || status > 2)
      return ResponseEntity.badRequest().build();

    UsersDto updatedUser = usersService.updateUserStatus(userId, status);
    return ResponseEntity.ok(updatedUser);
  }

  // --- JWT 토큰으로 현재 사용자 정보 확인 ---
  @GetMapping("/me")
  public ResponseEntity<UsersDto> getCurrentUser(HttpServletRequest request) {
    UsersDto user = usersService.getUserFromToken(request);
    if (user == null)
      return ResponseEntity.status(401).build();
    return ResponseEntity.ok(user);
  }

  // --- 마이페이지 데이터 ---
  @GetMapping("/mypage")
  public ResponseEntity<?> myPage(HttpServletRequest request) {
    UsersDto user = usersService.getUserFromToken(request);
    if (user == null)
      return ResponseEntity.status(401).body("로그인 필요");
    return ResponseEntity.ok(usersService.getMyPageData(user.getUserId()));
  }

  // --- 메인페이지 데이터 ---
  @GetMapping("/main")
  public ResponseEntity<?> mainPage() {
    return ResponseEntity.ok(usersService.getMainPageData());
  }

  // --- 비밀번호 변경 ---
  @PutMapping("/password")
  public ResponseEntity<?> updatePassword(@RequestBody PasswordChangeRequest requestDto, HttpServletRequest request) {
    UsersDto user = usersService.getUserFromToken(request);
    if (user == null)
      return ResponseEntity.status(401).body("로그인 필요");

    boolean success = usersService.updatePassword(user.getUserId(), requestDto.getCurrentPassword(),
        requestDto.getNewPassword());
    if (!success)
      return ResponseEntity.status(400).body("현재 비밀번호가 일치하지 않습니다.");

    return ResponseEntity.ok("비밀번호 변경 완료");
  }

  // --- 관리자: 모든 사용자 조회 (regDate 문자열 포함) ---
  @GetMapping
  public ResponseEntity<List<Map<String, Object>>> getAllUsers(HttpServletRequest request) {
    UsersDto currentUser = usersService.getUserFromToken(request);
    if (currentUser == null || !"admin".equals(currentUser.getRole()))
      return ResponseEntity.status(403).build();

    List<UsersDto> users = usersService.getAllUsers();
    List<Map<String, Object>> result = new ArrayList<>();

    for (UsersDto u : users) {
      Map<String, Object> map = new HashMap<>();
      map.put("userId", u.getUserId());
      map.put("username", u.getUsername());
      map.put("password", u.getPassword());
      map.put("role", u.getRole());
      map.put("status", u.getStatus());
      map.put("regDate", u.getRegDate() != null ? u.getRegDate().toString() : null);
      result.add(map);
    }

    return ResponseEntity.ok(result);
  }

  // --- DTO 클래스 (컨트롤러 내부) ---
  public static class PasswordChangeRequest {
    private String currentPassword;
    private String newPassword;

    public String getCurrentPassword() {
      return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
      this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
      return newPassword;
    }

    public void setNewPassword(String newPassword) {
      this.newPassword = newPassword;
    }
  }
}
