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
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "COMMENTS")
public class CommentsEntity {

    @Id
    @Column(name = "comment_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentIdx;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @ManyToOne
    @JoinColumn(name = "review_idx", nullable = false)
    private ReviewEntity review;

    @Column(nullable = false, length = 255)
    private String content;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "update_at")
    @Builder.Default
    private LocalDateTime updateAt = LocalDateTime.now();
}