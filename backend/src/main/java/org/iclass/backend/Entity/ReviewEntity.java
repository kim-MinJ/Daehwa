package org.iclass.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Entity
@Table(name = "REVIEW")
public class ReviewEntity {

  @Id
  @Column(name = "review_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long reviewIdx;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UsersEntity user;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @Column(nullable = false, length = 2000)
  private String content;

  @Column(name = "rating")
  @Builder.Default
  private Integer rating = 10;

  @Column(name = "created_at")
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "update_at")
  @Builder.Default
  private LocalDateTime updateAt = LocalDateTime.now();

  @Column
  @Builder.Default
  private Integer isBlind = 0;  // 0: off, 1: on
}
