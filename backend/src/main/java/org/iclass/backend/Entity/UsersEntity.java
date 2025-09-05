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
    private String role = "user";

    @Column(name = "reg_date")
    private LocalDateTime regDate = LocalDateTime.now();

<<<<<<< HEAD
    @Column
    private Integer status = 0;
=======
  @Column
  private Integer status = 0; // 로그인 상태 0:로그인 1:로그아웃
>>>>>>> ae25e7826b07dfc0a8f1cc5d79cdb317a3802a3a
}