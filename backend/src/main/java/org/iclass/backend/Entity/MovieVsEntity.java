package org.iclass.backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "MOVIE_VS")
public class MovieVsEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "VS_idx")
  private Long vsIdx;

  @ManyToOne
  @JoinColumn(name = "movie_VS1", nullable = false)
  private MovieInfoEntity movieVs1;

  @ManyToOne
  @JoinColumn(name = "movie_VS2", nullable = false)
  private MovieInfoEntity movieVs2;

  private Integer active = 0;
}