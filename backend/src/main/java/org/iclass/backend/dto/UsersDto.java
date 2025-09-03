package org.iclass.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UsersDto {
  private String userId;
  private String username;
  private String password;
  private String role;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {
  private String userId;
  private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDto {
  private String username;
  private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDto {
  private Long movieIdx;
}