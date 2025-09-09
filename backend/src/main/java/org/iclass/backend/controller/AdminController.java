package org.iclass.backend.controller;

import java.util.Map;

import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

  private final UsersRepository usersRepository;

  // 관리자 코드
  private final String ADMIN_CODE = "소통해조";

  @PutMapping("/grant")
  public ResponseEntity<?> grantAdminRole(
      @RequestParam String adminCode,
      Authentication authentication) {

    if (!ADMIN_CODE.equals(adminCode)) {
      return ResponseEntity.badRequest()
          .body(Map.of("message", "잘못된 관리자 코드입니다."));
    }

    // 현재 로그인한 사용자 아이디
    String userId = authentication.getName();

    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    user.setRole("admin");
    usersRepository.save(user);

    return ResponseEntity.ok(Map.of(
        "message", "관리자 권한이 부여되었습니다.",
        "role", user.getRole())); 
  }
}