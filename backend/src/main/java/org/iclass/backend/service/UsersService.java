package org.iclass.backend.service;

import org.iclass.backend.Entity.UsersEntity;
import org.iclass.backend.dto.LoginDto;
import org.iclass.backend.dto.UpdateUserDto;
import org.iclass.backend.dto.UsersDto;
import org.iclass.backend.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UsersService {

  private final UsersRepository usersRepository;

  public UsersService(UsersRepository usersRepository) {
    this.usersRepository = usersRepository;
  }

  public UsersEntity register(UsersDto userDto) {
    UsersEntity user = new UsersEntity();
    user.setUserId(userDto.getUserId());
    user.setUsername(userDto.getUsername());
    user.setPassword(userDto.getPassword()); // 나중에 암호화 필요
    return usersRepository.save(user);
  }

  public Optional<UsersEntity> login(LoginDto loginDto) {
    return usersRepository.findByUserId(loginDto.getUserId())
        .filter(u -> u.getPassword().equals(loginDto.getPassword()));
  }

  public UsersEntity updateUser(String userId, UpdateUserDto updateUserDto) {
    UsersEntity user = usersRepository.findById(userId).orElseThrow();
    user.setUsername(updateUserDto.getUsername());
    user.setPassword(updateUserDto.getPassword());
    return usersRepository.save(user);
  }

  public void deleteUser(String userId) {
    usersRepository.deleteById(userId);
  }
}