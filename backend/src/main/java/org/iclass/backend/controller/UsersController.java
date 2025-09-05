package org.iclass.backend.controller;

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

  // JWT 토큰으로 현재 사용자 정보 확인
  @GetMapping("/me")
  public ResponseEntity<UsersDto> getCurrentUser(HttpServletRequest request) {
    UsersDto user = usersService.getUserFromToken(request);
    if (user == null) {
      return ResponseEntity.status(401).build();
    }
    return ResponseEntity.ok(user);
  }

  // 마이페이지 데이터
  @GetMapping("/mypage")
  public ResponseEntity<?> myPage(HttpServletRequest request) {
    UsersDto user = usersService.getUserFromToken(request);
    if (user == null) {
      return ResponseEntity.status(401).body("로그인 필요");
    }
    return ResponseEntity.ok(usersService.getMyPageData(user.getUserId()));
  }

  // 메인페이지 데이터
  @GetMapping("/main")
  public ResponseEntity<?> mainPage() {
    return ResponseEntity.ok(usersService.getMainPageData());
  }
}
