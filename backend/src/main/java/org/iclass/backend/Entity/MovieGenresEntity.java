package org.iclass.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "Movie_Genres")
public class MovieGenresEntity {

  @Id
  @Column(name = "MG_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long mgIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  @JsonBackReference
  private MovieInfoEntity movie;

  @ManyToOne
  @JoinColumn(name = "genre_id", referencedColumnName = "genre_idx", nullable = false)
  private GenresEntity genre;
}