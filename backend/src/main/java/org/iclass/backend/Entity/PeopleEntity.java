package org.iclass.backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "PEOPLE")
public class PeopleEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "person_idx")
  private Long personIdx;

  @Column(name = "tmdb_person_id")
  private Long tmdbPersonId;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false)
  private Integer gender;

  @Column(name = "profile_path")
  private String profilePath;

  private int popularity;
}
