package org.iclass.backend.entity;

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
@Table(name = "MOVIE_VS")
public class MovieVsEntity {

  @Id
  @Column(name = "VS_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long vsIdx;

  @ManyToOne
  @JoinColumn(name = "movie_VS1", nullable = false)
  private MovieInfoEntity movieVs1;

  @ManyToOne
  @JoinColumn(name = "movie_VS2", nullable = false)
  private MovieInfoEntity movieVs2;

  @Column
  @Builder.Default
  private Integer active = 0;
}