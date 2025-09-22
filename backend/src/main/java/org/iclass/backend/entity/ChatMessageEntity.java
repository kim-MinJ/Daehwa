package org.iclass.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHAT_MESSAGES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String role; // user / assistant / system

  @Column(name = "CONTENT", length = 4000)
  private String content;

  private LocalDateTime createdAt;

  // ✅ UsersEntity와 연관관계 매핑
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", referencedColumnName = "user_id") // FK
  private UsersEntity user;
}