package org.iclass.backend.asdf;

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
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "GENRES")
public class GenresEntity {

  @Id
  @Column(name = "genre_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long genreIdx;

  @Column(name = "genre_id", nullable = false)
  private Long genreId;

  @Column(nullable = false, length = 50)
  private String name;
}