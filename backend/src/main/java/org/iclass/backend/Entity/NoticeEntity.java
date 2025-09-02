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
@Table(name = "NOTICE")
public class NoticeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "notice_idx")
  private Long noticeIdx;

  @ManyToOne
  @JoinColumn(name = "userid", nullable = false)
  private UsersEntity user;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(nullable = false, length = 255)
  private String content;

  @Column(name = "created_date")
  private LocalDateTime createdDate = LocalDateTime.now();
}