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
public class GenresResponse {
    private List<GenresApiDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenresApiDto {
        private Long genre_idx;
        private Long genre_id;
        private String name;
    }
}