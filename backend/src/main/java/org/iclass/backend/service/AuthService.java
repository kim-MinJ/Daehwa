// package org.iclass.backend.service;


// import org.iclass.backend.dto.UsersDto;
// import org.iclass.backend.Entity.UsersEntity;
// import org.iclass.backend.repository.UsersRepository;
// import org.iclass.backend.security.JwtTokenProvider;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class AuthService {

//   private final UsersRepository usersRepository;
//   private final PasswordEncoder passwordEncoder;
//   private final JwtTokenProvider jwtTokenProvider;

//   // 회원가입
//   public UsersDto register(String userId, String username, String password) {
//     if (usersRepository.existsById(userId)) {
//       throw new RuntimeException("이미 존재하는 아이디입니다.");
//     }
//     UsersEntity entity = new UsersEntity();
//     entity.setUserId(userId);
//     entity.setUsername(username);
//     entity.setPassword(passwordEncoder.encode(password));
//     entity.setRole("user");
//     usersRepository.save(entity);

//     String token = jwtTokenProvider.createTokenWithUserId(userId);
//     return UsersDto.of(entity, token);
//   }

//   // 로그인
//   public UsersDto login(String userId, String password) {
//     UsersEntity entity = usersRepository.findById(userId)
//         .orElseThrow(() -> new RuntimeException("사용자 없음"));

//     if (!passwordEncoder.matches(password, entity.getPassword())) {
//       throw new RuntimeException("비밀번호 불일치");
//     }

//     String token = jwtTokenProvider.createTokenWithUserId(userId);
//     return UsersDto.of(entity, token);
//   }
// }