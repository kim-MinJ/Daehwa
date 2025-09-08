package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.asdf.UsersEntity;

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

    // ✅ Entity → DTO 변환
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

    // ✅ DTO → Entity 변환
    public UsersEntity toEntity() {
        return UsersEntity.builder()
                .userId(this.userId)
                .username(this.username)
                .password(this.password)
                .role(this.role)
                .regDate(this.regDate)
                .status(this.status)
                .build();
    }
}
