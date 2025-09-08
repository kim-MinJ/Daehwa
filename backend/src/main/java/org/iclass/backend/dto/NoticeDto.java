package org.iclass.backend.dto;

import java.time.LocalDateTime;

import org.iclass.backend.asdf.NoticeEntity;
import org.iclass.backend.asdf.UsersEntity;

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
@Table(name = "NOTICE")
public class NoticeDto {
    private Long noticeIdx;
    private String userId;      // UsersEntity의 userId
    private String title;
    private String content;
    private LocalDateTime createdDate;

    // ✅ Entity → DTO 변환
    public static NoticeDto of(NoticeEntity entity) {
        return NoticeDto.builder()
                .noticeIdx(entity.getNoticeIdx())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .title(entity.getTitle())
                .content(entity.getContent())
                .createdDate(entity.getCreatedDate())
                .build();
    }

    // ✅ DTO → Entity 변환
    public NoticeEntity toEntity(UsersEntity user) {
        return NoticeEntity.builder()
                .noticeIdx(this.noticeIdx)
                .user(user)   // 연관관계 매핑 (UsersEntity)
                .title(this.title)
                .content(this.content)
                .createdDate(this.createdDate)
                .build();
    }
}
