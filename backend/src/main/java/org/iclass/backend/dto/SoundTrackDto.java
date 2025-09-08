package org.iclass.backend.dto;

import org.iclass.backend.entity.SoundTrackEntity;
import org.iclass.backend.entity.MovieInfoEntity;

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
@Table(name = "SoundTrack")
public class SoundTrackDto {

    private Long soundtrackIdx;
    private Long movieIdx; // MovieInfoEntity의 movieIdx
    private String title;
    private String artist;
    private String playbackUrl;

    // ✅ Entity → DTO 변환
    public static SoundTrackDto of(SoundTrackEntity entity) {
        return SoundTrackDto.builder()
                .soundtrackIdx(entity.getSoundtrackIdx())
                .movieIdx(entity.getMovieInfo() != null ? entity.getMovieInfo().getMovieIdx() : null)
                .title(entity.getTitle())
                .artist(entity.getArtist())
                .playbackUrl(entity.getPlaybackUrl())
                .build();
    }

    // ✅ DTO → Entity 변환
    public SoundTrackEntity toEntity(MovieInfoEntity movie) {
        return SoundTrackEntity.builder()
                .soundtrackIdx(this.soundtrackIdx)
                .movieInfo(movie) // 연관관계 매핑 (MovieInfoEntity)
                .title(this.title)
                .artist(this.artist)
                .playbackUrl(this.playbackUrl)
                .build();
    }
}
