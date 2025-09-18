package org.iclass.backend.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.*;

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

  @Column(name = "VS_round", nullable = false)
  private Integer vsRound;

  @Column(name = "pair", nullable = false)
  private Integer pair;

  @ManyToOne
  @JoinColumn(name = "movie_VS1", nullable = false)
  private MovieInfoEntity movieVs1;

  @ManyToOne
  @JoinColumn(name = "movie_VS2", nullable = false)
  private MovieInfoEntity movieVs2;

  @Column(name = "active", nullable = false)
  @Builder.Default
  private Integer active = 0; // 0: 비활성, 1: 활성

  @Column(name = "start_date", nullable = false)
  private Date startDate;

  @Column(name = "end_date")
  private Date endDate;
}