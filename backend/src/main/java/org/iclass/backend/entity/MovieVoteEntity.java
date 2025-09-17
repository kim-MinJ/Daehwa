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
@Table(name = "MOVIE_VOTE")
public class MovieVoteEntity {

  @Id
  @Column(name = "vote_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long voteIdx;

  @ManyToOne
  @JoinColumn(name = "VS_idx", nullable = false)
  private MovieVsEntity movieVS;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UsersEntity user;

  @Column(name = "VS_date", nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  @Builder.Default
  private Date vsDate = new Date();
}
