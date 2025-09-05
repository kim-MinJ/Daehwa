package org.iclass.backend.dto;

import org.iclass.backend.Entity.PeopleEntity;

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
@ToString
@Builder
@Table(name = "PEOPLE")
public class PeopleDto {
    private Long personIdx;
    private Long tmdbPersonId;
    private String name;
    private Integer gender;      // 0: 남, 1: 여
    private String profilePath;
    private int popularity;

    // Entity → DTO 변환 메서드
    public static PeopleDto of(PeopleEntity entity) {
        return PeopleDto.builder()
                .personIdx(entity.getPersonIdx())
                .tmdbPersonId(entity.getTmdbPersonId())
                .name(entity.getName())
                .gender(entity.getGender())
                .profilePath(entity.getProfilePath())
                .popularity(entity.getPopularity())
                .build();
    }
}