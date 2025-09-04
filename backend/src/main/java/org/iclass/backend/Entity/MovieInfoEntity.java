package org.iclass.backend.Entity;

import java.time.LocalDate;

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
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Builder
@Table(name = "MOVIE_INFO")
public class MovieInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_idx")
    private Long movieIdx;

    @Column(name = "tmdb_movie_id")
    private Long tmdbMovieId;

    @Column(length = 100)
    private String title;

    @Column
    @Builder.Default
    private Double popularity = 0.0;

    @Column(name = "vote_count")
    @Builder.Default
    private Integer voteCount = 0;

    @Column(name = "vote_average")
    @Builder.Default
    private Double voteAverage = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer adult = 0; // 0: false, 1: true

    @Column(length = 2000, nullable = false)
    private String overview;

    @Column(name = "backdrop_path")
    private String backdropPath;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "release_date")
    private LocalDate releaseDate; // 시간 정보는 필요 없으므로 LocalDate 사용
}