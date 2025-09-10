package org.iclass.backend.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.iclass.backend.entity.VideosEntity;
import org.iclass.backend.entity.MovieInfoEntity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieVideoResponse {

    @JsonProperty("id")
    private Long tmdbMovieId;

    @JsonProperty("results")
    private List<VideoDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VideoDto {
        private String iso_639_1;
        private String iso_3166_1;
        private String name;

        @JsonProperty("key")
        private String key; // YouTube key

        private String site;
        private Integer size;
        private String type;
        private Boolean official;

        @JsonProperty("published_at")
        private String publishedAt;

        /**
         * DTO → Entity 변환
         */
        public VideosEntity toEntity(MovieInfoEntity movie) {
            return VideosEntity.builder()
                    .movie(movie)
                    .title(this.name)
                    .videoType(this.type)
                    .videoUrl("https://www.youtube.com/watch?v=" + this.key) // URL 생성
                    .thumbnailUrl("https://img.youtube.com/vi/" + this.key + "/hqdefault.jpg") // 썸네일 URL 생성
                    .build();
        }
    }
}
