package org.iclass.teamproject.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "MOVIE_VOTE")
public class MovieVoteEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "vote_idx")
  private Long voteIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @ManyToOne
  @JoinColumn(name = "userid", nullable = false)
  private UsersEntity user;

  @ManyToOne
  @JoinColumn(name = "VS_idx", nullable = false)
  private MovieVsEntity movieVS;
}