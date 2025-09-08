package org.iclass.backend.asdf;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "VIDEOS")
public class VideosEntity {

    @Id
    @Column(name = "video_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoIdx;

    @ManyToOne
    @JoinColumn(name = "movie_idx", nullable = false)
    private MovieInfoEntity movie;

    private String title;

    @Column(name = "video_type")
    private String videoType;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "thumnail_url")
    private String thumnailUrl;
}