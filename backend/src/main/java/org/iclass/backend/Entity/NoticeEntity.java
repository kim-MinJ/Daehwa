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
@Table(name = "NOTICE")
public class NoticeEntity {

  @Id
  @Column(name = "notice_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long noticeIdx;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UsersEntity user;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(nullable = false, length = 2000)
  private String content;

  @Column(name = "created_date")
  @Builder.Default
  private LocalDateTime createdDate = LocalDateTime.now();
}