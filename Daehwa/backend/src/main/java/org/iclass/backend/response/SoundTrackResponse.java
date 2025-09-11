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
public class SoundTrackResponse {
    private List<SoundTrackApiDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SoundTrackApiDto {
        private Long soundtrack_idx;
        private Long movie_idx;
        private String title;
        private String artist;
        private String playback_url;
    }
}
