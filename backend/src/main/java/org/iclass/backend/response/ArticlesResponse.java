package org.iclass.backend.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticlesResponse {
    private List<ArticlesApiDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ArticlesApiDto {
        private Long articles_idx;
        private Long movie_idx;
        private String title;
        private String source_name;
        private String article_url;
        private String published_at;
    }
}