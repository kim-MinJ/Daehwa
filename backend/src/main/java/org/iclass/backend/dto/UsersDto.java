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

    private String userId;
    private String username;
    private String password;
    private String role;
    private LocalDateTime regDate;
    private Integer status;
    private String token;

    // Entity → DTO 변환 메서드
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
}
