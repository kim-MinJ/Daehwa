package org.iclass.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.BookmarkRepository;
import org.iclass.backend.repository.CommentsRepository;
import org.iclass.backend.repository.ReviewRepository;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class UsersService {

  private final ReviewRepository reviewRepository;

  private final BookmarkRepository bookmarkRepository;

  private final CommentsRepository commentsRepository;

  private final UsersRepository usersRepository;
  private final JwtTokenProvider jwtTokenProvider;
  private final PasswordEncoder passwordEncoder;

  public UsersService(UsersRepository usersRepository, JwtTokenProvider jwtTokenProvider,
      PasswordEncoder passwordEncoder, CommentsRepository commentsRepository, BookmarkRepository bookmarkRepository,
      ReviewRepository reviewRepository) {
    this.usersRepository = usersRepository;
    this.jwtTokenProvider = jwtTokenProvider;
    this.passwordEncoder = passwordEncoder;
    this.commentsRepository = commentsRepository;
    this.bookmarkRepository = bookmarkRepository;
    this.reviewRepository = reviewRepository;
  }

  // JWT 토큰에서 사용자 정보 가져오기
  public UsersDto getUserFromToken(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer "))
      return null;

    String token = header.substring(7);
    String userId = jwtTokenProvider.getUserId(token);
    if (userId == null)
      return null;

    UsersEntity entity = usersRepository.findByUserId(userId).orElse(null);
    if (entity == null)
      return null;

    return buildUsersDto(entity, token);
  }

  // username 업데이트
  public UsersDto updateUsername(String userId, String newUsername) {
    UsersEntity entity = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    entity.setUsername(newUsername);
    usersRepository.save(entity);

    return buildUsersDto(entity, null); // 수정 시 토큰은 필요 없음
  }

  // 상태 업데이트 (0=일반,1=접속7일제한,2=정지)
  public UsersDto updateUserStatus(String userId, int status) {
    if (status < 0 || status > 2) {
      throw new IllegalArgumentException("잘못된 상태 값");
    }

    UsersEntity entity = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    entity.setStatus(status);
    usersRepository.save(entity);

    return buildUsersDto(entity, null);
  }

  // 비밀번호 변경
  public boolean updatePassword(String userId, String currentPassword, String newPassword) {
    UsersEntity entity = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
      return false;
    }

    entity.setPassword(passwordEncoder.encode(newPassword));
    usersRepository.save(entity);
    return true;
  }

  // 모든 사용자 조회
  public List<UsersDto> getAllUsers() {
    return usersRepository.findAll().stream()
        .map(entity -> buildUsersDto(entity, null))
        .collect(Collectors.toList());
  }

  // DTO 빌더 공통 메서드
  private UsersDto buildUsersDto(UsersEntity entity, String token) {
    return UsersDto.builder()
        .userId(entity.getUserId())
        .username(entity.getUsername())
        .password(entity.getPassword())
        .role(entity.getRole())
        .regDate(entity.getRegDate())
        .status(entity.getStatus())
        .token(token)
        .build();
  }

  @Transactional
  public void hardDeleteUser(String userId) {
    UsersEntity user = usersRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));

    // 댓글 삭제
    commentsRepository.deleteAllByUser(user);

    // 리뷰 삭제
    reviewRepository.deleteAllByUser(user);

    // 북마크 삭제
    bookmarkRepository.deleteAllByUser(user);

    // 마지막으로 사용자 삭제
    usersRepository.delete(user);
  }

  // 마이페이지 데이터
  public Object getMyPageData(String userId) {
    return List.of("최근 본 영화1", "최근 본 영화2", "최근 본 영화3");
  }

  // 메인페이지 데이터
  public Object getMainPageData() {
    return List.of("인기 영화1", "인기 영화2", "인기 영화3");
  }
}
