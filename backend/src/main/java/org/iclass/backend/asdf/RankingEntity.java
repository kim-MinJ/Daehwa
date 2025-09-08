package org.iclass.backend.asdf;

import java.time.LocalDateTime;

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
@Table(name = "RANKING")
public class RankingEntity {

  @Id
  @Column(name = "ranking_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long rankingIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @Column(name = "ranking_count")
  private Double rankingCount;

  @Column(name = "created_date")
  @Builder.Default
  private LocalDateTime createdDate = LocalDateTime.now();
}