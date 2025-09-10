package org.iclass.backend.security;

import lombok.RequiredArgsConstructor;

import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UsersRepository usersRepository;

  @Override
  public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
    UsersEntity user = usersRepository.findByUserId(userId)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

    return User.builder()
        .username(user.getUserId())
        .password(user.getPassword())
        .roles(user.getRole())
        .build();
  }
}