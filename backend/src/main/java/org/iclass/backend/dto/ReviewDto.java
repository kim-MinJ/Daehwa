package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.Entity.ReviewEntity;

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
@Table(name = "REVIEW")
public class ReviewDto {
    private Long reviewIdx;
    private String userId;         // UsersEntity의 userId
    private String content;
    private Integer rating;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private Integer isBlind;       // 0: off, 1: on

    // Entity → DTO 변환 메서드
    public static ReviewDto of(ReviewEntity entity) {
        return ReviewDto.builder()
                .reviewIdx(entity.getReviewIdx())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .content(entity.getContent())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .updateAt(entity.getUpdateAt())
                .isBlind(entity.getIsBlind())
                .build();
    }
}