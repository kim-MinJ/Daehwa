package org.iclass.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UsersRepository usersRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  public UsersDto registerUser(String userId, String username, String password) {
    Optional<UsersEntity> existing = usersRepository.findById(userId);

    // 기존 ID가 있고 status != 3이면 중복 처리
    if (existing.isPresent() && existing.get().getStatus() != 3) {
      throw new RuntimeException("이미 존재하는 ID입니다.");
    }

    UsersEntity newUser = UsersEntity.builder()
        .userId(userId)
        .username(username)
        .password(passwordEncoder.encode(password))
        .role("user")
        .status(0)
        .build();

    usersRepository.save(newUser);
    return UsersDto.of(newUser, null);
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

    String token = jwtTokenProvider.generateToken(entity.getUserId());
    return UsersDto.of(entity, token);
    // 커밋용
  }
}
