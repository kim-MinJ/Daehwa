package org.iclass.backend.dto;

import java.time.LocalDate;

import org.iclass.backend.Entity.ArticlesEntity;

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
@Table(name = "ARTICLES")
public class ArticlesDto {
    private Long articlesIdx;
    private Long movieIdx;
    private String title;
    private String sourceName;
    private String articleUrl;
    private LocalDate publishedAt;

    // Entity → DTO 변환 메서드
    public static ArticlesDto of(ArticlesEntity entity) {
        return ArticlesDto.builder()
                .articlesIdx(entity.getArticlesIdx())
                .movieIdx(entity.getMovie().getMovieIdx()) // MovieInfoEntity의 movieIdx
                .title(entity.getTitle())
                .sourceName(entity.getSourceName())
                .articleUrl(entity.getArticleUrl())
                .publishedAt(entity.getPublishedAt())
                .build();
    }
}