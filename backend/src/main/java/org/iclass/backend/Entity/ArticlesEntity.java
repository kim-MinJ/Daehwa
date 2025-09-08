package org.iclass.backend.entity;

import java.time.LocalDate;

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
@Table(name = "ARTICLES")
public class ArticlesEntity {

  @Id
  @Column(name = "articles_idx")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long articlesIdx;

  @ManyToOne
  @JoinColumn(name = "movie_idx", nullable = false)
  private MovieInfoEntity movie;

  private String title;

  @Column(name = "source_name")
  private String sourceName;

  @Column(name = "article_url")
  private String articleUrl;

  @Column(name = "published_at")
  private LocalDate publishedAt;
}