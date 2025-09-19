package org.iclass.backend.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Builder
@Table(name = "MOVIE_INFO")
public class MovieInfoEntity {

    @Id
    @Column(name = "movie_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movieIdx;

    @Column(name = "tmdb_movie_id")
    private Long tmdbMovieId;

    @Column(length = 500)
    private String title;

    @Column(columnDefinition = "binary_double")
    @Builder.Default
    private Double popularity = 0.0;

    @Column(name = "vote_count")
    @Builder.Default
    private Integer voteCount = 0;

    @Column(name = "vote_average", columnDefinition = "binary_double")
    @Builder.Default
    private Double voteAverage = 0.0;

    @Column(name = "ADULT", nullable = false)
    @Builder.Default
    private Boolean adult = false; // 0: false, 1: true

    @Column(length = 2000)
    private String overview;

    @Column(name = "backdrop_path")
    private String backdropPath;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "release_date")
    private LocalDate releaseDate; // 시간 정보는 필요 없으므로 LocalDate 사용

    // MovieGenres 연결
    @OneToMany(mappedBy = "movie", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<MovieGenresEntity> movieGenres;

    // 장르 이름 리스트 반환
    public List<String> getGenres() {
        if (movieGenres == null)
            return List.of();
        return movieGenres.stream()
                .map(mg -> mg.getGenre().getName())
                .distinct()
                .toList();
    }

}