package org.iclass.backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "BOOKMARK")
public class BookMarkEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "bookmark_idx")
  private Long bookmarkIdx;

  @ManyToOne
  @JoinColumn(name = "userid", nullable = false)
  private UsersEntity user;
}