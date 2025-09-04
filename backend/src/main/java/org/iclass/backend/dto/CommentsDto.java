package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.Entity.CommentsEntity;

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
@Table(name = "COMMENTS")
public class CommentsDto {
    private Long commentIdx;
    private String userId;    // UsersEntity의 userId
    private Long reviewIdx;   // ReviewEntity의 reviewIdx
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    // Entity → DTO 변환 메서드
    public static CommentsDto of(CommentsEntity entity) {
        return CommentsDto.builder()
                .commentIdx(entity.getCommentIdx())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .reviewIdx(entity.getReview() != null ? entity.getReview().getReviewIdx() : null)
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .updateAt(entity.getUpdateAt())
                .build();
    }
}