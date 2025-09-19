package org.iclass.backend.entity;

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

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "Movie_Vote")
public class MovieVoteEntity {

  @Id
  @Column(name = "vote_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long voteIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UsersEntity user;

  @ManyToOne
  @JoinColumn(name = "VS_idx", nullable = false) // 🔥 임시로 투표 증가 확인을 위해 true로 변경
  private MovieVsEntity movieVS;
  
  @Column(name = "vs_date", nullable = false)
  @Builder.Default
  private LocalDateTime vsDate = LocalDateTime.now();
}