package org.iclass.teamproject.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "Users")
@Entity
public class UsersEntity {
  @Id
  @Column(name = "user_id", length = 100)
  private String userId;

  @Column(nullable = false, length = 50)
  private String username;

  @Column(nullable = false, length = 16)
  private String password;

  @Column(length = 20)
  private String role = "user";

  @Column(name = "reg_date")
  private LocalDateTime regDate = LocalDateTime.now();

  @Column
  private Integer status = 0;
}