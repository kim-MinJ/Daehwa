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

@Entity
@Table(name = "MOVIE_CREW")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieCrewEntity {

    @Id
    @Column(name = "CREDIT_IDX")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long creditIdx;

    @Column(name = "TMDB_MOVIE_ID", nullable = false)
    private Long tmdbMovieId;

    @Column(name = "TMDB_CREW_ID")
    private Long tmdbCrewId;

    @Column(name = "CREW_NAME", length = 255)
    private String crewName;

    @Column(name = "CREW_PROFILE_PATH", length = 255)
    private String crewProfilePath;

    @Column(name = "JOB", length = 255)
    private String job;
}