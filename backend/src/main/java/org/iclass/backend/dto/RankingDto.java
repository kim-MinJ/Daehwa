package org.iclass.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankingDto {
    private Long rankingIdx;
    private Long movieId;
    private String movieTitle;
    private Integer rankingCount;
    private LocalDateTime createdDate;
}
