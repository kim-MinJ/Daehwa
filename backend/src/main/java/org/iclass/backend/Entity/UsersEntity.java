package org.iclass.backend.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Builder // ← 이거 추가
@ToString
@Table(name = "Users")
@Entity
public class UsersEntity {
    @Id
    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(length = 20)
    @Builder.Default
    private String role = "user";

    @Column(name = "reg_date")
    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now();

    @Column
    @Builder.Default
    private Integer status = 0; // 로그인 상태 0:로그인 1:로그아웃

}