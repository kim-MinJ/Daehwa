package org.iclass.backend.dto;

import org.iclass.backend.Entity.MovieCreditsEntity;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "MOVIE_CREDITS")
public class MovieCreditsDto {
    private Long creditIdx;
    private Long movieIdx;   // MovieInfoEntity의 movieIdx
    private Long personIdx;  // PeopleEntity의 personIdx
    private String roleType;
    private String character;
    private Integer creditOrder;
    private String department;
    private String job;

    // Entity → DTO 변환 메서드
    public static MovieCreditsDto of(MovieCreditsEntity entity) {
        return MovieCreditsDto.builder()
                .creditIdx(entity.getCreditIdx())
                .movieIdx(entity.getMovie() != null ? entity.getMovie().getMovieIdx() : null)
                .personIdx(entity.getPerson() != null ? entity.getPerson().getPersonIdx() : null)
                .roleType(entity.getRoleType())
                .character(entity.getCharacter())
                .creditOrder(entity.getCreditOrder())
                .department(entity.getDepartment())
                .job(entity.getJob())
                .build();
    }
}
