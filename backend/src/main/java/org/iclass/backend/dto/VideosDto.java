package org.iclass.backend.dto;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.VideosEntity;

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
@Builder
@ToString
@Table(name = "VIDEOS")
public class VideosDto {

    private Long videoIdx;
    private Long movieIdx; // MovieInfoEntity 참조
    private String title;
    private String videoType;
    private String videoUrl;
    private String thumnailUrl;

    // ✅ Entity → DTO 변환
    public static VideosDto of(VideosEntity entity) {
        return VideosDto.builder()
                .videoIdx(entity.getVideoIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null) // 외래키 참조
                .title(entity.getTitle())
                .videoType(entity.getVideoType())
                .videoUrl(entity.getVideoUrl())
                .thumnailUrl(entity.getThumnailUrl())
                .build();
    }

    // ✅ DTO → Entity 변환
    public VideosEntity toEntity(MovieInfoEntity movie) {
        return VideosEntity.builder()
                .videoIdx(this.videoIdx)
                .movie(movie)  // 연관관계 매핑 (MovieInfoEntity)
                .title(this.title)
                .videoType(this.videoType)
                .videoUrl(this.videoUrl)
                .thumnailUrl(this.thumnailUrl)
                .build();
    }
}
