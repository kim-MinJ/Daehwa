package org.iclass.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieVoteDto {
    private Long voteIdx;
    private Long movieId;
    private String userId;
    private Long vsId;
}