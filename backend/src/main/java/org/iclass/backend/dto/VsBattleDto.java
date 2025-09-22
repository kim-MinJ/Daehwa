package org.iclass.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class VsBattleDto {
    private Long vsIdx;           
    private String daysAgo;       
    private long totalVotes;      

    private Long movie1Id;
    private String movie1Title;
    private String movie1Poster;
    private String movie1Director;
    private double movie1Rating;
    private long movie1Votes;
    private int movie1Percentage;

    private Long movie2Id;
    private String movie2Title;
    private String movie2Poster;
    private String movie2Director;
    private double movie2Rating;
    private long movie2Votes;
    private int movie2Percentage;

    private boolean isMovie1Winner;
    private Long votedMovieId;

    private java.util.Date startDate;
}
