package org.iclass.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
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
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_Ranking")
@SequenceGenerator(name = "SEQ_Ranking", sequenceName = "SEQ_Ranking", allocationSize = 1)
@Column(name = "ranking_idx")
private Long rankingIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @Column(name = "ranking_count", columnDefinition = "binary_double")
  private Double rankingCount;

  @Column(name = "created_date")
  @Builder.Default
  private LocalDateTime createdDate = LocalDateTime.now();
}