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
public class PeopleResponse {
    private List<PeopleApiDto> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeopleApiDto {
        private Long person_idx;
        private Long tmdb_person_id;
        private String name;
        private Integer gender;
        private String profile_path;
        private Double popularity;
    }
}