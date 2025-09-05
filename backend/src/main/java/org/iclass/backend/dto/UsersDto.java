package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.Entity.UsersEntity;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "Users")
public class UsersDto {
<<<<<<< HEAD
  private String userId;
  private String username;
  private String password;
  private String role;
  private LocalDateTime regDate;
  private Integer status;
  private String token;

  public static UsersDto of(UsersEntity entity, String token) {
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
=======

    private String userId;
    private String username;
    private String password;
    private String role;
    private LocalDateTime regDate;
    private Integer status;

    // Entity → DTO 변환 메서드
    public static UsersDto of(UsersEntity entity) {
        return UsersDto.builder()
                .userId(entity.getUserId())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .role(entity.getRole())
                .regDate(entity.getRegDate())
                .status(entity.getStatus())
                .build();
    }
>>>>>>> ae25e7826b07dfc0a8f1cc5d79cdb317a3802a3a
}
