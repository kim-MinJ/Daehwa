package org.iclass.backend.service;

import lombok.RequiredArgsConstructor;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UsersRepository usersRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  public UsersDto register(String userId, String username, String password) {
    if (usersRepository.existsById(userId))
      throw new RuntimeException("이미 존재하는 아이디입니다.");

    UsersEntity entity = UsersEntity.builder()
        .userId(userId)
        .username(username)
        .password(passwordEncoder.encode(password))
        .role("user")
        .regDate(LocalDateTime.now())
        .status(0)
        .build();

    usersRepository.save(entity);

    String token = jwtTokenProvider.createTokenWithUserId(entity.getUserId());
    return UsersDto.of(entity, token);
  }

  public UsersDto login(String userId, String password) {
    UsersEntity entity = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    if (!passwordEncoder.matches(password, entity.getPassword()))
      throw new RuntimeException("비밀번호 불일치");

    // 상태 체크
    if (entity.getStatus() == 2) {
      throw new RuntimeException("정지된 계정입니다.");
    }
    if (entity.getStatus() == 1) {
      throw new RuntimeException("접속제한 중인 계정입니다.");
    }

    String token = jwtTokenProvider.createTokenWithUserId(entity.getUserId());
    return UsersDto.of(entity, token);
  }
}
