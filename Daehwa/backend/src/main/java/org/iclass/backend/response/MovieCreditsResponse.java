package org.iclass.backend.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieCreditsResponse {
    private List<MovieCreditsApiDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieCreditsApiDto {
        private Long credit_idx;
        private Long movie_idx;
        private Long person_idx;
        private String role_type;
        private String character;
        private Integer credit_order;
        private String department;
        private String job;
    }
}