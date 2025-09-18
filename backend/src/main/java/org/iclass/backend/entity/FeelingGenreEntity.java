package org.iclass.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Feeling_Genres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeelingGenreEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feeling_genres_seq")
  @SequenceGenerator(name = "feeling_genres_seq", sequenceName = "SEQ_Feeling_Genres", allocationSize = 1)
  @Column(name = "FEELINGGENREIDX")
  private Long feelingGenreIdx;

  @Column(name = "FEELINGTYPE", nullable = false, length = 100)
  private String feelingType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "GENREIDX", nullable = false)
  private GenresEntity genre;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "MOVIEIDX", nullable = false)
  private MovieInfoEntity movie;
}
