package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

  private final UsersRepository usersRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  // 회원가입
  public UsersDto register(UsersDto usersDto) {
    if (usersRepository.findByUserId(usersDto.getUserId()).isPresent()) {
      log.warn("이미 존재하는 아이디입니다: {}", usersDto.getUserId());
      throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
    }

    UsersEntity usersEntity = new UsersEntity();
    usersEntity.setUserId(usersDto.getUserId());
    usersEntity.setUsername(usersDto.getUsername());
    usersEntity.setPassword(passwordEncoder.encode(usersDto.getPassword()));
    usersEntity.setRole("user"); // 기본 권한
    usersEntity.setRegDate(LocalDateTime.now());
    usersEntity.setStatus(0);

    usersRepository.save(usersEntity);

    // 토큰 생성
    usersDto.setRole(usersEntity.getRole());
    usersDto.setToken(jwtUtil.generateToken(usersEntity.getUserId(), usersEntity.getRole()));
    usersDto.setRegDate(usersEntity.getRegDate());
    usersDto.setStatus(usersEntity.getStatus());

    return usersDto;
  }

  // 로그인
  public UsersDto login(UsersDto usersDto) {
    UsersEntity usersEntity = usersRepository.findByUserId(usersDto.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    if (!passwordEncoder.matches(usersDto.getPassword(), usersEntity.getPassword())) {
      throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
    }

    usersDto.setRole(usersEntity.getRole());
    usersDto.setRegDate(usersEntity.getRegDate());
    usersDto.setStatus(usersEntity.getStatus());
    usersDto.setToken(jwtUtil.generateToken(usersEntity.getUserId(), usersEntity.getRole()));

    return usersDto;
  }

  // 로그아웃 (서버 로직 없음)
  public void logout() {
    log.info("클라이언트 측에서 토큰을 삭제하여 로그아웃 처리합니다.");
  }
}
