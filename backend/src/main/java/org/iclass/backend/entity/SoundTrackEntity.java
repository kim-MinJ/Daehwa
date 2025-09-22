package org.iclass.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Sound_Track")
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

    @Column(name = "title", length = 500)
    private String title; // OST 제목

    @Column(name = "youtube_idx", length = 500)
    private String youtubeIdx; // YouTube video ID
}
