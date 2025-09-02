package org.iclass.teamproject.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "GENRES")
public class GenresEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "genre_idx")
  private Long genreIdx;

  @Column(name = "genre_id", nullable = false)
  private Long genreId;

  @Column(nullable = false, length = 50)
  private String name;
}