package org.iclass.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "SoundTrack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoundTrackEntity {

    @Id
    @Column(name = "soundtrack_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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