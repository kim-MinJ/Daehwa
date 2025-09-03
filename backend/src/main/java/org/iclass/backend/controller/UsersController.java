package org.iclass.backend.controller;

import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.LoginDto;
import org.iclass.backend.dto.UpdateUserDto;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/users")
public class UsersController {

  private final UsersService usersService;

  public UsersController(UsersService usersService) {
    this.usersService = usersService;
  }

  @PostMapping("/register")
  public ResponseEntity<UsersEntity> register(@RequestBody UsersDto userDto) {
    return ResponseEntity.ok(usersService.register(userDto));
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody LoginDto loginDto, HttpSession session) {
    return usersService.login(loginDto)
        .map(user -> {
          session.setAttribute("user", user);
          return ResponseEntity.ok("로그인 성공");
        })
        .orElse(ResponseEntity.status(401).body("로그인 실패"));
  }

  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok("로그아웃 성공");
  }

  @GetMapping("/me")
  public ResponseEntity<UsersEntity> getMyInfo(HttpSession session) {
    UsersEntity user = (UsersEntity) session.getAttribute("user");
    if (user == null)
      return ResponseEntity.status(401).build();
    return ResponseEntity.ok(user);
  }

  @PutMapping("/me")
  public ResponseEntity<UsersEntity> updateMyInfo(HttpSession session,
      @RequestBody UpdateUserDto updateUserDto) {
    UsersEntity user = (UsersEntity) session.getAttribute("user");
    if (user == null)
      return ResponseEntity.status(401).build();
    return ResponseEntity.ok(usersService.updateUser(user.getUserId(), updateUserDto));
  }
}
