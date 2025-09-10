package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.ReviewEntity;
import org.iclass.backend.entity.UsersEntity;

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
    private Long movieIdx;         // MovieInfoEntity의 movieIdx
    private String userId;         // UsersEntity의 userId
    private String content;
    private Integer rating;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private Integer isBlind;       // 0: off, 1: on

    // ✅ Entity → DTO 변환
    public static ReviewDto of(ReviewEntity entity) {
        return ReviewDto.builder()
                .reviewIdx(entity.getReviewIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .content(entity.getContent())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .updateAt(entity.getUpdateAt())
                .isBlind(entity.getIsBlind())
                .build();
    }

    // ✅ DTO → Entity 변환
    public ReviewEntity toEntity(UsersEntity user, MovieInfoEntity movie) {
        return ReviewEntity.builder()
                .reviewIdx(this.reviewIdx)
                .user(user)          // UsersEntity 연관관계
                .movie(movie)        // MovieInfoEntity 연관관계
                .content(this.content)
                .rating(this.rating)
                .createdAt(this.createdAt)
                .updateAt(this.updateAt)
                .isBlind(this.isBlind)
                .build();
    }
}