package org.iclass.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SoundTrack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoundTrackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_SoundTrack")
    @SequenceGenerator(name = "SEQ_SoundTrack", sequenceName = "SEQ_SoundTrack", // DB에 생성한 시퀀스 이름과 동일해야 함
            allocationSize = 1)
    @Column(name = "soundtrack_idx")
    private Long soundtrackIdx; // OST 인덱스 (PK)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_idx", nullable = false)
    private MovieInfoEntity movieInfo; // 영화 정보 (FK)

    @Column(name = "title", length = 255)
    private String title; // OST 제목

    @Column(name = "artist", length = 255)
    private String artist; // 작곡가

    @Column(name = "playback_url", length = 500)
    private String playbackUrl; // OST 링크
}