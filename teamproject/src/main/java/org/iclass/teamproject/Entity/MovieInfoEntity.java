package org.iclass.teamproject.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "MOVIE_INFO")
public class MovieInfoEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "movie_idx")
  private Long movieIdx;

  @Column(name = "tmdb_movie_id")
  private Long tmdbMovieId;

  private String title;
  private Double popularity = 0.0;
  private Integer voteCount = 0;
  private Double voteAverage = 0.0;
  private Integer adult = 0;

  @Column(nullable = false, length = 500)
  private String overview;

  @Column(name = "backdrop_path")
  private String backdropPath;

  @Column(name = "poster_path")
  private String posterPath;

  @Column(name = "release_date")
  private LocalDateTime releaseDate;
}