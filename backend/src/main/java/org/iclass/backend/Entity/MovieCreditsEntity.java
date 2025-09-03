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
@Table(name = "MOVIE_CREDITS")
public class MovieCreditsEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "credit_idx")
  private Long creditIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  @ManyToOne
  @JoinColumn(name = "person_idx", nullable = false)
  private PeopleEntity person;

  @Column(name = "role_type", length = 10)
  private String roleType;

  private String character;

  @Column(name = "credit_order")
  private Integer creditOrder;

  private String department;
  private String job;
}