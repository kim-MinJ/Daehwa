package org.iclass.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Movie_Vs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"movieVs1", "movieVs2"})
public class MovieVsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_Movie_VS")
    @SequenceGenerator(name = "SEQ_Movie_VS", sequenceName = "SEQ_Movie_VS", allocationSize = 1)
    @Column(name = "VS_idx")
    private Long vsIdx;

    @Column(name = "VS_round", nullable = false)
    private Integer vsRound;

    @Column(nullable = false)
    private Integer pair;

    @ManyToOne
    @JoinColumn(name = "movie_VS1", nullable = false)
    private MovieInfoEntity movieVs1;

    @ManyToOne
    @JoinColumn(name = "movie_VS2", nullable = false)
    private MovieInfoEntity movieVs2;

    @Column(nullable = false)
    @Builder.Default
    private Integer active = 0;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;
}
