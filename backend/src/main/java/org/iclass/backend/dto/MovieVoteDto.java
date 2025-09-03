package org.iclass.backend.dto;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Movie_Vote")
public class MovieVoteDto {
    private Long voteIdx;
    private Long movieId;
    private String userId;
    private Long vsId;
}