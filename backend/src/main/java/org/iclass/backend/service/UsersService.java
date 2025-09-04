package org.iclass.backend.service;

import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtUtil;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class UsersService {

  private final UsersRepository usersRepository;
  private final JwtUtil jwtUtil;

  public UsersService(UsersRepository usersRepository, JwtUtil jwtUtil) {
    this.usersRepository = usersRepository;
    this.jwtUtil = jwtUtil;
  }

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
}
