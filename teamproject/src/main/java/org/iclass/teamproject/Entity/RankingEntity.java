package org.iclass.teamproject.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "RANKING")
public class RankingEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ranking_idx")
  private Long rankingIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @Column(name = "ranking_count")
  private Integer rankingCount;

  @Column(name = "created_date")
  private LocalDateTime createdDate = LocalDateTime.now();
}