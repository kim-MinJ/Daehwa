package org.iclass.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "MOVIE_CAST")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieCastEntity {

    @Id
    @Column(name = "CAST_IDX")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long castIdx;

    @Column(name = "TMDB_MOVIE_ID", nullable = false)
    private Long tmdbMovieId;

    @Column(name = "TMDB_CAST_ID", nullable = false)
    private Long tmdbCastId;

    @Column(name = "CHARACTER", length = 255)
    private String character;

    @Column(name = "CAST_NAME", length = 255)
    private String castName;

    @Column(name = "CAST_PROFILE_PATH", length = 255)
    private String castProfilePath;

    @Column(name = "CREDIT_ORDER")
    private Integer creditOrder;
}