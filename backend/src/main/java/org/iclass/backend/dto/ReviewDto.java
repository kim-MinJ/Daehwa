package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.Entity.ReviewEntity;
import org.iclass.backend.Entity.UsersEntity;

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
@Table(name = "review")
public class ReviewDto {
  private Long reviewIdx;
  private UsersEntity user;
  private String content;
  private Integer rationg;
  private LocalDateTime createdAt;
  private LocalDateTime updateAt;
  private Integer isBlind;

  public static ReviewDto of(ReviewEntity entity) {
    return ReviewDto.builder()
        .reviewIdx(entity.getReviewIdx())
        .user(entity.getUser())
        .content(entity.getContent())
        .rationg(entity.getRationg())
        .createdAt(entity.getCreatedAt())
        .updateAt(entity.getUpdateAt())
        .isBlind(entity.getIsBlind())
        .build();
  }

}
