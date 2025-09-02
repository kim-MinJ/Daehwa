package org.iclass.backend.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "REVIEW")
public class ReviewEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "review_idx")
  private Long reviewIdx;

  @ManyToOne
  @JoinColumn(name = "userid", nullable = false)
  private UsersEntity user;

  @Column(nullable = false, length = 255)
  private String content;

  @Column(name = "rationg") // 오타 주의: DB에 맞춤
  private Integer rationg = 10;

  @Column(name = "created_at")
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "update_at")
  private LocalDateTime updateAt = LocalDateTime.now();

  private Integer isBlind = 0;
}