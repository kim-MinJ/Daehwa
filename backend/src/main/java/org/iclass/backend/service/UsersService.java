package org.iclass.backend.service;

import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsersService {

  private final UsersRepository usersRepository;
  private final JwtUtil jwtUtil;

  // JWT 토큰에서 사용자 정보 가져오기
  public UsersDto getUserFromToken(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer "))
      return null;

    String token = header.substring(7);
    String userId = jwtUtil.getUserId(token);
    if (userId == null)
      return null;

    UsersEntity entity = usersRepository.findByUserId(userId).orElse(null);
    if (entity == null)
      return null;

    // Builder 패턴으로 DTO 생성
    return UsersDto.builder()
        .userId(entity.getUserId())
        .username(entity.getUsername())
        .password(entity.getPassword()) // 필요 없으면 제거 가능
        .role(entity.getRole()) // 필요 없으면 제거 가능
        .regDate(entity.getRegDate()) // 필요 없으면 제거 가능
        .status(entity.getStatus()) // 필요 없으면 제거 가능
        .token(token) // JWT 토큰
        .build();
  }

  // 마이페이지 데이터
  public Object getMyPageData(String userId) {
    // DB 조회 후 DTO 반환
    return List.of(
        "최근 본 영화1",
        "최근 본 영화2",
        "최근 본 영화3");
  }

  // 메인페이지 데이터
  public Object getMainPageData() {
    // DB 조회 후 DTO 반환
    return List.of(
        "인기 영화1",
        "인기 영화2",
        "인기 영화3");
  }

  public UsersDto updateUsername(String userId, String newUsername) {
    UsersEntity entity = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    entity.setUsername(newUsername);
    usersRepository.save(entity);

    return UsersDto.builder()
        .userId(entity.getUserId())
        .username(entity.getUsername())
        .role(entity.getRole())
        .regDate(entity.getRegDate())
        .status(entity.getStatus())
        .token(null) // 수정 시 새 토큰은 안 줘도 됨
        .build();
  }

  // UsersService 클래스 안에 추가
  private final PasswordEncoder passwordEncoder; // 기존 생성자에 주입

  public UsersService(UsersRepository usersRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
    this.usersRepository = usersRepository;
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = passwordEncoder;
  }

  public boolean updatePassword(String userId, String currentPassword, String newPassword) {
    UsersEntity entity = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    // 현재 비밀번호 확인
    if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
      return false;
    }

    // 새 비밀번호 인코딩 후 저장
    entity.setPassword(passwordEncoder.encode(newPassword));
    usersRepository.save(entity);
    return true;
  }

  public List<UsersDto> getAllUsers() {
    return usersRepository.findAll()
        .stream()
        .map(user -> UsersDto.builder()
            .userId(user.getUserId())
            .username(user.getUsername())
            .role(user.getRole())
            .status(user.getStatus())
            .build())
        .collect(Collectors.toList());
  }
}
