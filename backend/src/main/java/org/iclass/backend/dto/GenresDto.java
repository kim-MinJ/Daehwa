package org.iclass.backend.dto;


import org.iclass.backend.entity.GenresEntity;

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
@Table(name = "GENRES")
public class GenresDto {
    private Long genreIdx;
    private Long genreId;
    private String name;

    // ✅ Entity → DTO 변환
    public static GenresDto of(GenresEntity entity) {
        return GenresDto.builder()
                .genreIdx(entity.getGenreIdx())
                .genreId(entity.getGenreId())
                .name(entity.getName())
                .build();
    }

    // ✅ DTO → Entity 변환
    public GenresEntity toEntity() {
        return GenresEntity.builder()
                .genreIdx(this.genreIdx)
                .genreId(this.genreId)
                .name(this.name)
                .build();
    }
}
